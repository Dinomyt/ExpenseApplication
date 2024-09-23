using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Services;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExpenseController : ControllerBase
    {
        private readonly ExpenseItemService _data;
        public ExpenseController(ExpenseItemService dataFromService) {
            _data = dataFromService;
        }

        [HttpGet]
        public async Task<IEnumerable<ExpenseItemModel>> getExpenses(){
            return _data.GetAllExpenseItems();
        }
        

        //Create an expense item
        [HttpPost("AddExpenseItems")]
        public bool AddExpenseItems(ExpenseItemModel expense){
            return _data.AddExpenseItems(expense);
        }

        //Delete an expense item
        [HttpDelete("DeleteExpenseItem/{ExpenseDelete}")]
        public bool DeleteExpenseItem(ExpenseItemModel ExpenseDelete){
            return _data.DeleteExpenseItem(ExpenseDelete);
        }

        //GetAllExpenseItems 
        [HttpGet("GetExpenseItems")]

        public IEnumerable<ExpenseItemModel> GetAllExpenseItems()
        {
            return _data.GetAllExpenseItems();
        }

        //UpdateExpenseItems
        [HttpPost("UpdateExpenseItems")]
        public bool UpdateExpenseItems(ExpenseItemModel ExpenseUpdate)
        {
            return _data.UpdateExpenseItems(ExpenseUpdate);
        } 

        //Get expense items by user id
        [HttpGet("GetItemsByUserId/{UserId}")]
        public IEnumerable<ExpenseItemModel> GetItemsByUserId (int UserId)
        {
            return _data.GetItemsByUserId(UserId);
        }
            
        [HttpGet("GetPublishedItems")]
        public IEnumerable<ExpenseItemModel> GetPublishedItems() 
        {
            return _data.GetPublishedItems();
        }

        //GetExpenseItemsByCategory
        [HttpGet("GetExpenseItemsByCategory/{Category}")]
        public IEnumerable<ExpenseItemModel> GetItemByCategory(string Category)
        {
            return _data.GetItemByCategory(Category);
        }         
    }
}