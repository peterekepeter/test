

using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public static class EnumerableExtensions
{
    public static int FindJsonEnd(this IEnumerable<byte> source)
    {
        int index = 0;
        int count = 0;
        foreach (var item in source){
            if (item == '{'){
                count++;
            }
            if (item == '}'){
                count--;
            }
            index++;
            if (count == 0){
                return index;
            }
        }
        return index;
    }

}