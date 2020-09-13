using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Repositories
{
    public abstract class GenericRepository<T> : IRepository<T> where T : class
    {
        protected readonly BifuuBotContext context;

        protected GenericRepository(BifuuBotContext context)
        {
            this.context = context;
        }

        public virtual T Add(T entity)
        {
            return context.Add(entity).Entity;
        }
        public virtual async Task<IEnumerable<T>> Find(Expression<Func<T, bool>> predicate)
        {
            return await context.Set<T>().AsQueryable().Where(predicate).ToListAsync();
        }
        public virtual async Task<T> Get(int id)
        {
            return await context.FindAsync<T>(id);
        }
        public virtual async Task<IEnumerable<T>> GetAll()
        {
            return await context.Set<T>().ToListAsync();
        }
        public virtual T Update(T entity)
        {
            return context.Update(entity).Entity;
        }
        public async Task<bool> SaveChanges()
        {
            return await context.SaveChangesAsync() > 0;
        }
    }
}
