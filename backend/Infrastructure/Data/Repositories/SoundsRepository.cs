using Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Data.Repositories
{
    public class SoundsRepository : GenericRepository<Sound>
    {
        public SoundsRepository(BifuuBotContext context) : base(context)
        {
        }
    }
}
