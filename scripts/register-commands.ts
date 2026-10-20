import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import { DISCORD_APPLICATION_COMMANDS } from '../src/utils/discordCommands';

dotenv.config();

const token = process.env.DISCORD_BOT_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID || '1561923039896272916';
const guildId = process.env.DISCORD_GUILD_ID;

if (!token) {
  console.error('Error: DISCORD_BOT_TOKEN is required in .env');
  process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(token);

async function register() {
  try {
    console.log(`[Silence Designs] Prepared ${DISCORD_APPLICATION_COMMANDS.length} commands for registration.`);

    if (guildId) {
      console.log(`Targeting Guild ID: ${guildId}`);
      const data: any = await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: DISCORD_APPLICATION_COMMANDS }
      );
      console.log(`✓ Successfully registered ${data.length} commands to guild ${guildId}`);
    } else {
      console.log('No DISCORD_GUILD_ID specified in .env. Deploying globally...');
      const data: any = await rest.put(
        Routes.applicationCommands(clientId),
        { body: DISCORD_APPLICATION_COMMANDS }
      );
      console.log(`✓ Successfully registered ${data.length} global commands.`);
    }
  } catch (error) {
    console.error('Failed to register commands:', error);
  }
}

register();
