using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Repositories
{
    public interface IRepository<T>
    {
        T Add(T entity);
        T Update(T entity);
        Task<T> Get(int id);
        Task<IEnumerable<T>> GetAll();
        Task<IEnumerable<T>> Find(Expression<Func<T, bool>> predicate);
        Task<bool> SaveChanges();
    }
}
