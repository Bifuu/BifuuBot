using Core.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure
{
    public class BifuuBotContext : DbContext
    {
        public BifuuBotContext(DbContextOptions<BifuuBotContext> options) : base(options)
        {
        }

        public DbSet<Sound> Sounds { get; set; }
    }
}
