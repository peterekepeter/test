using System;
using System.Collections.Generic;

namespace multi_user_todo_list
{
    public class DocumentModel
    {
        public DateTime created = DateTime.UtcNow;
        public DateTime modified = DateTime.UtcNow;
        public string documentId;
        public int maxOrder = 0;
        public List<dynamic> commands = new List<dynamic>();
    }
}