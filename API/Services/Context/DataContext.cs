using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Services.Context;










public class DataContext : DbContext
{
    public DataContext(DbContextOptions options) : base(options)
    {
        
    }

    public DbSet<UserModel> UserInfo {get; set;}
    public DbSet<ExpenseItemModel> ExpenseInfo {get; set;}

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
    }
}