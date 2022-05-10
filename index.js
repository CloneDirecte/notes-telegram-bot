import { Telegraf } from "telegraf";
import edNotes from "ed-notes";
import * as fs from "fs";
import dotenv from "dotenv";
dotenv.config();

var username = process.env.ED_USERNAME;
var password = process.env.ED_PASSWORD;

if (!process.env.TOKEN) throw new Error("No TOKEN in .env");
const bot = new Telegraf(process.env.TOKEN);

if (!username || !password)
  throw new Error("No ED_USERNAME or ED_PASSWORD in .env");

bot.start(async (ctx) => {
  const chatId = ctx.chat.id;
  if (!process.env.ID) {
    ctx.reply(
      `Il n'y a aucun ID dans le .env. \nSi vous êtes le propriétaire du bot, vous pouvez le changer au votre. \nSi vous avez recemment mis l'ID dans le .env, essayez de redémarrer le bot. \nVoici votre ID utilisateur: ${chatId}. \nPour relancer, envoyez /start.`
    );
  } else if (Number(process.env.ID) === NaN) {
    ctx.reply(
      `L'ID dans le .env n'est pas un nombre. \nRappel: \n- votre user ID est ${chatId}.`
    );
  } else if (Number(process.env.ID) === chatId) {
    ctx.reply(
      "Bonjour, nous avons lancé le check chaque heure pour de nouvelles notes."
    );
    console.log("Check chaque heure commencé! ");
    async function edNotesCall() {
      try {
        var edNotesReturn = JSON.parse(fs.readFileSync("./edNotesReturn.json"));
        edNotesReturn.data.notes.sort((a, b) => {
          return a.dateSaisie.localeCompare(b.dateSaisie);
        });
        var write = await edNotes(username, password);
        write.data.notes.sort((a, b) => {
          return a.dateSaisie.localeCompare(b.dateSaisie);
        });
        if (write.data.notes.length > edNotesReturn.data.notes.length) {
          var i = edNotesReturn.data.notes.length;
          while (i < write.data.notes.length) {
            var message = `Nouvelle note en ${write.data.notes[i].libelleMatiere}: ${write.data.notes[i].valeur}/${write.data.notes[i].noteSur}, coef ${write.data.notes[i].coef}, pour le devoir "${write.data.notes[i].devoir}"`;
            ctx.reply(message);
            console.log(message);
            i++;
          }
        } else {
          console.log("Pas de nouvelles notes.");
        }
        fs.writeFileSync("./edNotesReturn.json", JSON.stringify(write));
      } catch (err) {
        if (err) {
          var firstInit = await edNotes(username, password);
          fs.writeFileSync("./edNotesReturn.json", JSON.stringify(firstInit));
          console.log("Created ./edNotesReturn.json");
        }
      }
    }
    await edNotesCall();
    setInterval(await edNotesCall, 1000 * 60 * 60);
  } else {
    ctx.reply(
      `Une erreur est survenue. \nSolutions: \n- Vous avez probablement entré le mauvais user ID ou \n- vous n'êtes pas le propriétaire du bot. \nRappel: votre user ID est ${chatId}.`
    );
  }
});

bot.launch().then(console.log("Bot lancé!"));