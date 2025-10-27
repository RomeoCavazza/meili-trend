import os
import discord
from discord.ext import commands
from discord import app_commands

TOKEN = os.getenv("DISCORD_TOKEN")
GUILD_ID = int(os.getenv("GUILD_ID", "0"))

intents = discord.Intents.default()
intents.guilds = True
intents.members = True

bot = commands.Bot(command_prefix="!", intents=intents)

ROLE_STUDENT = "Student"
ROLE_HELPER = "Helper"

# -------- Utils --------
async def get_or_create_role(guild: discord.Guild, name: str) -> discord.Role:
    r = discord.utils.get(guild.roles, name=name)
    if r is None:
        r = await guild.create_role(name=name, reason="Setup auto")
    return r

def can_manage(guild: discord.Guild, role: discord.Role) -> bool:
    me: discord.Member = guild.me  # le bot en tant que membre
    return me.guild_permissions.manage_roles and role.position < me.top_role.position

# -------- Ready + sync --------
@bot.event
async def on_ready():
    print(f"✅ Connecté en tant que {bot.user}")
    guild = bot.get_guild(GUILD_ID)
    if guild:
        try:
            await bot.tree.sync(guild=discord.Object(id=GUILD_ID))
            print(f"✅ Slash commands synchronisées sur {guild.name}")
        except Exception as e:
            print(f"⚠️ Erreur sync slash: {e}")
    else:
        print("⚠️ Serveur introuvable, vérifie GUILD_ID.")

# -------- Auto-Student à l’arrivée --------
@bot.event
async def on_member_join(member: discord.Member):
    if member.guild.id != GUILD_ID:
        return
    role = discord.utils.get(member.guild.roles, name=ROLE_STUDENT)
    if not role:
        return
    if can_manage(member.guild, role):
        try:
            await member.add_roles(role, reason="Auto-assign Student on join")
            print(f"🎓 Student attribué à {member} (join)")
        except discord.Forbidden:
            print("❌ Missing permissions pour ajouter Student (join).")
    else:
        print("⚠️ Rôle Student au-dessus du bot ou permissions manquantes.")

# -------- /setup_roles (admin) --------
@bot.tree.command(name="setup_roles", description="Créer les rôles Student et Helper s'ils manquent",
                  guild=discord.Object(id=GUILD_ID))
@app_commands.checks.has_permissions(manage_guild=True)
async def setup_roles(inter: discord.Interaction):
    guild = inter.guild
    student = await get_or_create_role(guild, ROLE_STUDENT)
    helper = await get_or_create_role(guild, ROLE_HELPER)
    await inter.response.send_message(
        f"✅ Rôles prêts : `{student.name}` et `{helper.name}`.\n"
        "ℹ️ Assure-toi que **le rôle du bot** est au-dessus de ces rôles dans *Paramètres du serveur → Rôles*.",
        ephemeral=True
    )

# -------- Toggler générique --------
async def toggle_self_role(inter: discord.Interaction, role_name: str):
    guild = inter.guild
    role = discord.utils.get(guild.roles, name=role_name)
    if role is None:
        await inter.response.send_message(
            f"⚠️ Le rôle `{role_name}` n'existe pas. Lance `/setup_roles` ou crée-le.",
            ephemeral=True
        )
        return

    if not can_manage(guild, role):
        me = guild.me
        await inter.response.send_message(
            "⛔ Impossible de modifier le rôle.\n"
            f"- Vérifie que le bot a **Manage Roles**\n"
            f"- Place le rôle **{me.top_role.name}** **au-dessus** de `{role.name}` dans la hiérarchie.",
            ephemeral=True
        )
        return

    member = inter.user
    try:
        if role in member.roles:
            await member.remove_roles(role, reason=f"Toggle via /{role_name.lower()}")
            await inter.response.send_message(f"❎ Rôle **{role.name}** retiré.", ephemeral=True)
        else:
            await member.add_roles(role, reason=f"Toggle via /{role_name.lower()}")
            await inter.response.send_message(f"✅ Rôle **{role.name}** attribué.", ephemeral=True)
    except discord.Forbidden:
        await inter.response.send_message("⛔ Permissions insuffisantes (Forbidden).", ephemeral=True)

# -------- /helper --------
@bot.tree.command(name="helper", description="Activer/désactiver le rôle Helper",
                  guild=discord.Object(id=GUILD_ID))
async def helper_cmd(inter: discord.Interaction):
    await toggle_self_role(inter, ROLE_HELPER)

# -------- /student --------
@bot.tree.command(name="student", description="Activer/désactiver le rôle Student",
                  guild=discord.Object(id=GUILD_ID))
async def student_cmd(inter: discord.Interaction):
    await toggle_self_role(inter, ROLE_STUDENT)

# -------- Run --------
bot.run(TOKEN)
