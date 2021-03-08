# ![Tracer Logo](https://raw.githubusercontent.com/flex-dapps/tracer/master/src/assets/logo.svg?token=ARQNWBY5CEHRCBF7X6EP6D277QAHM)


Generating IPFS content 
* HTML editor [https://html-online.com/editor/](https://html-online.com/editor/)
* Compress it [https://www.textfixer.com/html/compress-html-compression.php](https://www.textfixer.com/html/compress-html-compression.php)

Post to ipfs in the format of 
{
   "title":"Sigma Prime Audit",
   "summary":"Lion's Mane recommends that the Tracer DAO should evaluate engaging Sigma Prime for a security audit of Tracer’s code",
   "text":"<p>HTML TEXT</p>",
   "function_call":"transfer", 
   // from here its just function params so can be whatever
   "account":"0x9CE6e6E4D9C9d6163258Db90a4AAB86ef4d1F7D5",
   "amount":"112050",
   "discourse_url":"https://discourse.tracer.finance/t/sigma-prime-audit/74",
   "currency":"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
}
