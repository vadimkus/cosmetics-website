/**
 * Checkout form rendered inside the chat (MCP Apps, `ui://` resource). Self-contained
 * HTML: no build step, no CDN. It talks to the host over the MCP Apps postMessage
 * protocol (and ChatGPT's window.openai bridge when that is what the host provides),
 * shows the items from open_checkout, and submits through the place_order tool.
 * The server re-prices everything; the totals here are for display only.
 */

export const CHECKOUT_UI_URI = 'ui://genosys/checkout-v1.html'
export const MCP_APP_MIME = 'text/html;profile=mcp-app'

export const CHECKOUT_UI_META = {
  ui: {
    csp: { resourceDomains: ['https://genosys.ae'], connectDomains: [] as string[] },
    prefersBorder: true,
  },
}

const STRINGS = {
  en: {
    title: 'Checkout', delivery: 'Delivery details', name: 'Full name', email: 'Email', phone: 'Phone',
    phoneHint: '050 123 4567 or with country code', emirate: 'Emirate', address: 'Address',
    addressHint: 'Building or villa, street, area, apartment', notes: 'Delivery notes (optional)',
    shade: 'Shade', choose: 'Choose', qty: 'Qty', subtotal: 'Subtotal', shipping: 'Delivery', free: 'Free',
    total: 'Total', vat: 'Prices include 5% VAT', pay: 'Continue to secure payment', placing: 'Creating your order…',
    done: 'Order created', openPay: 'Open payment page', payNote: 'Pay by card, Apple Pay or Google Pay on Stripe. Your order is confirmed by email once paid.',
    required: 'Please fill in every field.', pickShade: 'Please choose a shade.', freeFrom: 'Free delivery from AED 1,000',
    uae: 'Delivery within the UAE only', remove: 'Remove',
  },
  ru: {
    title: 'Оформление заказа', delivery: 'Доставка', name: 'Имя и фамилия', email: 'Email', phone: 'Телефон',
    phoneHint: '050 123 4567 или с кодом страны', emirate: 'Эмират', address: 'Адрес',
    addressHint: 'Здание или вилла, улица, район, квартира', notes: 'Комментарий к доставке (необязательно)',
    shade: 'Оттенок', choose: 'Выберите', qty: 'Кол-во', subtotal: 'Товары', shipping: 'Доставка', free: 'Бесплатно',
    total: 'Итого', vat: 'Цены включают НДС 5%', pay: 'Перейти к безопасной оплате', placing: 'Создаём заказ…',
    done: 'Заказ создан', openPay: 'Открыть страницу оплаты', payNote: 'Оплата картой, Apple Pay или Google Pay на странице Stripe. Подтверждение придёт на email после оплаты.',
    required: 'Пожалуйста, заполните все поля.', pickShade: 'Пожалуйста, выберите оттенок.', freeFrom: 'Бесплатная доставка от 1 000 AED',
    uae: 'Доставка только по ОАЭ', remove: 'Удалить',
  },
  ar: {
    title: 'إتمام الطلب', delivery: 'بيانات التوصيل', name: 'الاسم الكامل', email: 'البريد الإلكتروني', phone: 'الهاتف',
    phoneHint: '050 123 4567 أو مع رمز الدولة', emirate: 'الإمارة', address: 'العنوان',
    addressHint: 'المبنى أو الفيلا، الشارع، المنطقة، الشقة', notes: 'ملاحظات التوصيل (اختياري)',
    shade: 'الدرجة', choose: 'اختاري', qty: 'الكمية', subtotal: 'المنتجات', shipping: 'التوصيل', free: 'مجاني',
    total: 'الإجمالي', vat: 'الأسعار تشمل ضريبة 5%', pay: 'المتابعة إلى الدفع الآمن', placing: 'جارٍ إنشاء الطلب…',
    done: 'تم إنشاء الطلب', openPay: 'فتح صفحة الدفع', payNote: 'ادفعي بالبطاقة أو Apple Pay أو Google Pay عبر Stripe. يصلكِ تأكيد الطلب بالبريد بعد الدفع.',
    required: 'يرجى تعبئة جميع الحقول.', pickShade: 'يرجى اختيار الدرجة.', freeFrom: 'توصيل مجاني من 1,000 درهم',
    uae: 'التوصيل داخل الإمارات فقط', remove: 'إزالة',
  },
} as const

export function checkoutHtml(): string {
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
:root{--ink:#1f1f1f;--muted:#6b6b6b;--line:#e6e2dd;--bg:#fff;--soft:#f7f5f2;--brand:#b52c36}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--ink:#f2f2f2;--muted:#a8a8a8;--line:#3a3a3a;--bg:#1e1e1e;--soft:#262626}}
:root[data-theme=dark]{--ink:#f2f2f2;--muted:#a8a8a8;--line:#3a3a3a;--bg:#1e1e1e;--soft:#262626}
*{box-sizing:border-box}body{margin:0;font:14px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:var(--ink);background:var(--bg)}
.wrap{padding:16px;max-width:560px;margin:0 auto}
.head{display:flex;align-items:center;gap:10px;margin-bottom:12px}.head img{width:28px;height:28px}.head b{font-size:16px;letter-spacing:.02em}
.item{display:flex;gap:12px;align-items:center;padding:10px 0;border-bottom:1px solid var(--line)}
.item img{width:56px;height:56px;object-fit:cover;border-radius:8px;background:var(--soft)}
.item .n{flex:1;min-width:0}.item .n b{display:block;font-size:13px;line-height:1.3}.item .n small{color:var(--muted)}
.item .p{text-align:end;white-space:nowrap}.item select,.item input{margin-top:6px}
.qty{width:56px}.x{background:none;border:0;color:var(--muted);cursor:pointer;font-size:12px;padding:0;margin-top:4px}
h3{font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin:18px 0 8px;font-weight:600}
label{display:block;font-size:12px;color:var(--muted);margin:10px 0 4px}
input,select,textarea{width:100%;padding:10px 12px;border:1px solid var(--line);border-radius:10px;background:var(--bg);color:var(--ink);font:inherit}
input:focus,select:focus,textarea:focus{outline:2px solid var(--brand);outline-offset:-1px}
.row{display:flex;gap:10px}.row>div{flex:1}
.tot{margin-top:14px;padding:12px;border-radius:12px;background:var(--soft)}
.tot div{display:flex;justify-content:space-between;margin:3px 0}.tot .g{font-weight:700;font-size:15px;margin-top:8px}
.note{color:var(--muted);font-size:12px;margin-top:6px}
button.cta{width:100%;margin-top:14px;padding:13px;border:0;border-radius:12px;background:var(--brand);color:#fff;font:600 15px/1 inherit;cursor:pointer}
button.cta[disabled]{opacity:.6;cursor:default}
.err{color:#c62828;font-size:13px;margin-top:10px;min-height:1em}
.ok{text-align:center;padding:12px 0}.ok b{font-size:16px}.ok code{display:block;margin:6px 0 2px;font-size:15px}
[dir=rtl] .item .p{text-align:start}
</style></head>
<body><div class="wrap" id="app"><p class="note">…</p></div>
<script>
(function(){
var S=${JSON.stringify(STRINGS)};
var state={data:null,t:S.en,busy:false,done:null};
var rid=0,pending={};
var openai=window.openai;
function post(m){try{window.parent.postMessage(m,'*')}catch(e){}}
function rpc(method,params){return new Promise(function(res,rej){var id=++rid;pending[id]={res:res,rej:rej};post({jsonrpc:'2.0',id:id,method:method,params:params||{}});setTimeout(function(){if(pending[id]){delete pending[id];rej(new Error('timeout'))}},60000)})}
function notify(method,params){post({jsonrpc:'2.0',method:method,params:params||{}})}
window.addEventListener('message',function(e){var m=e.data;if(!m||m.jsonrpc!=='2.0')return;
  if(m.id!=null&&!m.method&&pending[m.id]){var p=pending[m.id];delete pending[m.id];m.error?p.rej(new Error(m.error.message||'error')):p.res(m.result);return}
  if(m.method==='ui/notifications/tool-result'){var sc=m.params&&m.params.structuredContent;if(sc&&sc.items)load(sc);return}
  if(m.method==='ui/notifications/host-context-changed'){theme(m.params);return}
  if(m.method&&m.id!=null){post({jsonrpc:'2.0',id:m.id,result:{}})}
});
function theme(ctx){var t=ctx&&ctx.theme;if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);document.documentElement.style.colorScheme=t}}
function size(){notify('ui/notifications/size-changed',{height:Math.ceil(document.documentElement.scrollHeight)})}
function callTool(name,args){
  if(openai&&openai.callTool)return openai.callTool(name,args);
  return rpc('tools/call',{name:name,arguments:args});
}
function openLink(url){
  if(openai&&openai.openExternal){try{openai.openExternal({href:url});return}catch(e){}}
  rpc('ui/open-link',{url:url}).catch(function(){window.open(url,'_blank')});
}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function money(n){var v=Math.round(n*100)/100;return 'AED '+v.toLocaleString('en-US',{minimumFractionDigits:v%1?2:0,maximumFractionDigits:2})}
function load(d){state.data=d;state.t=S[d.locale]||S.en;document.documentElement.dir=d.locale==='ar'?'rtl':'ltr';render()}
function subtotal(){return state.data.items.reduce(function(s,i){return s+i.unit_price_aed*i.quantity},0)}
function fee(){var d=state.data,sub=subtotal(),em=val('emirate');if(sub>=d.delivery.free_from_aed)return 0;return d.delivery.rates_aed[em]!=null?d.delivery.rates_aed[em]:0}
function val(id){var el=document.getElementById(id);return el?el.value.trim():''}
function totals(){var t=state.t,sub=subtotal(),f=fee();
  document.getElementById('tot').innerHTML='<div><span>'+t.subtotal+'</span><span>'+money(sub)+'</span></div><div><span>'+t.shipping+'</span><span>'+(f?money(f):t.free)+'</span></div><div class="g"><span>'+t.total+'</span><span>'+money(sub+f)+'</span></div>';size()}
function render(){var d=state.data,t=state.t,app=document.getElementById('app');
  if(state.done){app.innerHTML='<div class="ok"><b>'+t.done+'</b><code>'+esc(state.done.order_number)+'</code><p class="note">'+t.payNote+'</p><button class="cta" id="pay">'+t.openPay+' · '+money(state.done.total_aed)+'</button></div>';
    document.getElementById('pay').onclick=function(){openLink(state.done.pay_url)};size();return}
  var items=d.items.map(function(i,k){
    var shade=i.shades&&i.shades.length?'<select data-k="'+k+'" class="shade"><option value="">'+t.shade+': '+t.choose+'</option>'+i.shades.map(function(s){return '<option value="'+esc(s.value)+'"'+(i.color===s.value?' selected':'')+'>'+esc(s.label)+'</option>'}).join('')+'</select>':'';
    return '<div class="item"><img src="'+esc(i.image||'https://genosys.ae/icon-192x192.png')+'" alt=""><div class="n"><b>'+esc(i.name)+'</b><small>'+esc([i.size_label,i.color_label].filter(Boolean).join(' · '))+'</small>'+shade+'</div><div class="p">'+money(i.unit_price_aed)+'<br><input class="qty" type="number" min="1" max="20" value="'+i.quantity+'" data-k="'+k+'" aria-label="'+t.qty+'">'+(d.items.length>1?'<br><button class="x" data-k="'+k+'">'+t.remove+'</button>':'')+'</div></div>'}).join('');
  var em=Object.keys(d.delivery.rates_aed).map(function(n){return '<option'+(d.prefill&&d.prefill.emirate===n?' selected':'')+'>'+esc(n)+'</option>'}).join('');
  var p=d.prefill||{};
  app.innerHTML='<div class="head"><img src="https://genosys.ae/icon-192x192.png" alt=""><b>GENOSYS · '+t.title+'</b></div>'+items+
   '<h3>'+t.delivery+'</h3><label for="name">'+t.name+'</label><input id="name" autocomplete="name" value="'+esc(p.name)+'">'+
   '<div class="row"><div><label for="email">'+t.email+'</label><input id="email" type="email" autocomplete="email" value="'+esc(p.email)+'"></div><div><label for="phone">'+t.phone+'</label><input id="phone" type="tel" autocomplete="tel" placeholder="'+t.phoneHint+'" value="'+esc(p.phone)+'"></div></div>'+
   '<label for="emirate">'+t.emirate+'</label><select id="emirate">'+em+'</select>'+
   '<label for="address">'+t.address+'</label><textarea id="address" rows="2" autocomplete="street-address" placeholder="'+t.addressHint+'">'+esc(p.address)+'</textarea>'+
   '<label for="notes">'+t.notes+'</label><input id="notes" value="'+esc(p.notes)+'">'+
   '<div class="tot" id="tot"></div><p class="note">'+t.vat+' · '+t.freeFrom+' · '+t.uae+'</p>'+
   '<button class="cta" id="go">'+t.pay+'</button><div class="err" id="err"></div>';
  Array.prototype.forEach.call(document.querySelectorAll('.qty'),function(el){el.oninput=function(){var q=Math.max(1,Math.min(20,parseInt(el.value,10)||1));d.items[+el.dataset.k].quantity=q;totals()}});
  Array.prototype.forEach.call(document.querySelectorAll('.shade'),function(el){el.onchange=function(){d.items[+el.dataset.k].color=el.value}});
  Array.prototype.forEach.call(document.querySelectorAll('.x'),function(el){el.onclick=function(){d.items.splice(+el.dataset.k,1);render()}});
  document.getElementById('emirate').onchange=totals;
  document.getElementById('go').onclick=submit;
  totals();
}
function submit(){if(state.busy)return;var d=state.data,t=state.t,err=document.getElementById('err');err.textContent='';
  var c={name:val('name'),email:val('email'),phone:val('phone'),emirate:val('emirate'),address:val('address')};
  if(!c.name||!c.email||!c.phone||!c.address){err.textContent=t.required;return}
  for(var k=0;k<d.items.length;k++){if(d.items[k].shades&&d.items[k].shades.length&&!d.items[k].color){err.textContent=t.pickShade;return}}
  var args={items:d.items.map(function(i){var o={product_id:i.id,quantity:i.quantity};if(i.size)o.size=i.size;if(i.color)o.color=i.color;return o}),customer:c,locale:d.locale};
  var notes=val('notes');if(notes)args.notes=notes;
  state.busy=true;var b=document.getElementById('go');b.disabled=true;b.textContent=t.placing;
  Promise.resolve(callTool('place_order',args)).then(function(r){
    var sc=r&&(r.structuredContent||r);
    if(!r||r.isError||!sc||!sc.pay_url){throw new Error((r&&r.content&&r.content[0]&&r.content[0].text)||'Order failed')}
    state.done=sc;render();openLink(sc.pay_url);
    rpc('ui/update-model-context',{content:[{type:'text',text:'Checkout form submitted: GENOSYS order '+sc.order_number+' created, total AED '+sc.total_aed+'. The Stripe payment page was opened for the shopper.'}]}).catch(function(){});
  }).catch(function(e){err.textContent=e.message||String(e);b.disabled=false;b.textContent=t.pay}).then(function(){state.busy=false;size()});
}
if(openai&&openai.theme)theme({theme:openai.theme});
if(openai&&openai.toolOutput&&openai.toolOutput.items){load(openai.toolOutput)}
window.addEventListener('openai:set_globals',function(){if(window.openai&&window.openai.toolOutput&&window.openai.toolOutput.items&&!state.data)load(window.openai.toolOutput)});
rpc('ui/initialize',{appInfo:{name:'genosys-checkout',version:'1.0.0'},appCapabilities:{},protocolVersion:'2026-01-26'}).then(function(r){theme(r&&r.hostContext);notify('ui/notifications/initialized',{});size()}).catch(function(){});
if(window.ResizeObserver)new ResizeObserver(size).observe(document.body);
})();
</script></body></html>`
}
