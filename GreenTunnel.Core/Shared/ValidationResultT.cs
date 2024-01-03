//using GreenTunnel.Core.Interfaces.Shared;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace GreenTunnel.Core.Shared
//{
//    public sealed class ValidationResultT<TValue> : Result<TValue, IValidationResult>
//    {
//        private ValidationResultT(Error[] errors)
//        :base(default,false,IValidationResult.ValidationError)=>
//            Error = errors;
//        public Error[] Errors { get;}
//        public sealed ValidationResult<TValue> WithErrors(Error[] errors) => new(errors);
//    }
//}
