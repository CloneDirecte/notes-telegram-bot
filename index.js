import { Telegraf } from "telegraf";
import edNotes from "ed-notes";
import * as fs from "fs";
import dotenv from "dotenv";
dotenv.config();

var username = process.env.ED_USERNAME;
var password = process.env.ED_PASSWORD;

var timeZone = process.env.TIME_ZONE;
var timeCheck = process.env.TIME_CHECK;

function logMsg(message) {
  console.log(
    `[${new Date().toLocaleString("en-US", {
      hour12: false,
      timeZone: `${timeZone ? timeZone : "UTC"}`,
    })}] ${message}`
  );
}

if (!process.env.TOKEN) throw new Error("No TOKEN in .env");
const bot = new Telegraf(process.env.TOKEN);

if (!username || !password)
  throw new Error("No ED_USERNAME or ED_PASSWORD in .env");

bot.start(async (ctx) => {
  const chatId = ctx.chat.id;
  if (!process.env.ID) {
    ctx.reply(
      `🚫 Il n'y a aucun ID dans le .env. \nSi vous êtes le propriétaire du bot, vous pouvez le changer au votre. \nSi vous avez recemment mis l'ID dans le .env, essayez de redémarrer le bot. \nVoici votre ID utilisateur: ${chatId}. \nPour relancer, envoyez /start.`
    );
  } else if (Number(process.env.ID) === NaN) {
    ctx.reply(
      `🚫 L'ID dans le .env n'est pas un nombre. \nRappel: \n- votre user ID est ${chatId}.`
    );
  } else if (Number(process.env.ID) === chatId) {
    ctx.reply(
      "👋 Bonjour, nous avons lancé le check chaque heure pour de nouvelles notes."
    );
    logMsg("Check chaque heure commencé! ");
    async function edNotesCall() {
      try {
        var edNotesReturn = JSON.parse(fs.readFileSync("./edNotesReturn.json"));
        var write = await edNotes(username, password);
        const sortEdNotesReturn = new Set(
          edNotesReturn.data.notes.map(({ devoir }) => devoir)
        );
        const removeDupes = write.data.notes.filter(
          ({ devoir }) => !sortEdNotesReturn.has(devoir)
        );
        removeDupes.sort((a, b) => {
          return a.libelleMatiere.localeCompare(b.libelleMatiere);
        });
        if (removeDupes.length === 0) {
          logMsg("Pas de nouvelles notes.");
        } else {
          removeDupes.map((item) => {
            if (item.valeur) {
              var message = `📝 Nouvelle note en ${item.libelleMatiere}: ${item.valeur}/${item.noteSur},\nCoefficient: ${item.coef},\nDevoir: "${item.devoir}"`;
              ctx.reply(message);
              logMsg(message);
            } else {
              logMsg(`Valeur de notes pour ${item.devoir} est inexistante`);
            }
          });
        }
        fs.writeFileSync("./edNotesReturn.json", JSON.stringify(write));
      } catch (err) {
        if (err) {
          var firstInit = await edNotes(username, password);
          fs.writeFileSync("./edNotesReturn.json", JSON.stringify(firstInit));
          logMsg("Created ./edNotesReturn.json");
        }
      }
    }
    await edNotesCall();
    setInterval(edNotesCall, timeCheck ? timeCheck : 1000 * 60 * 60);
  } else {
    ctx.reply(
      `🚫 Une erreur est survenue. \nSolutions: \n- Vous avez probablement entré le mauvais user ID ou \n- vous n'êtes pas le propriétaire du bot. \nRappel: votre user ID est ${chatId}.`
    );
  }
});

bot.launch().then(logMsg("Bot lancé!"));
