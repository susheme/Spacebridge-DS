// Targeted calendar and interaction checks, without browser layout.
var window = this, COMP_CSS = {}, handlers = [];
var document = {addEventListener: function(type, fn) { if(type==='click') handlers.push(fn); }, querySelector:function(){return null;}};
function sbT(en,ru){return en;}
function sbRegister(){}
function sbMkButton(o){return '<button '+(o.disabled?'disabled ':'')+(o.attrs||'')+'>'+(o.content||o.label||o.icon)+'</button>';}
function sbMkSel(o){return '<select>'+o.value+'</select>';}
function sbMkContextCard(content,o){return '<div class="sb-ctx-card '+o.cls+'">'+content+'</div>';}
function sbMkPopover(o){return o.trigger+o.content;}
load('js/components/datepicker.js');
function check(ok,msg){if(!ok) throw Error(msg);}
var leap=sbMkDatepicker({inline:true,value:'2024-02-15'});
check((leap.match(/data-date=/g)||[]).length===42,'leap February');
check(leap.indexOf('data-date="2024-02-30"')<0,'no invalid day');
var common=sbMkDatepicker({inline:true,value:'2025-02-15'});
check((common.match(/data-date=/g)||[]).length===42,'common February');
var limited=sbMkDatepicker({inline:true,value:'2024-02-15',min:'2024-02-10',max:'2024-02-20'});
check((limited.match(/<button disabled/g)||[]).length===33,'18 excluded dates plus month arrows');
var root={dataset:{month:'2024-12-01',value:'',locale:'en',min:'',max:'',disabled:'false'},innerHTML:'',querySelector:function(){return null;}};
var btn={disabled:false,closest:function(){return root;},getAttribute:function(k){return k==='data-month-step'?'1':null;}};
handlers[0]({target:{closest:function(){return btn;}}});
check(root.dataset.month==='2025-01-01','December to January');
check(root.innerHTML.indexOf('<button disabled')<0,'navigation leaves controls enabled');
root.dataset.month='2024-01-01';btn.getAttribute=function(k){return k==='data-month-step'?'-1':null;};
handlers[0]({target:{closest:function(){return btn;}}});
check(root.dataset.month==='2023-12-01','January to December');
print('Datepicker: calendar, bounds and month navigation passed');

function inputFor(part,value) { return {dataset:{calendarInput:part},value:value,closest:function(sel){return sel==='[data-datepicker]'?root:null;},setAttribute:function(k,v){this[k]=v;}}; }
root.dataset.month='2024-05-01';
sbDatepickerInputCommit(inputFor('year','2030'));
check(root.dataset.month==='2030-05-01','manual year');
sbDatepickerInputCommit(inputFor('month','12'));
check(root.dataset.month==='2030-12-01','numeric month');
sbDatepickerInputCommit(inputFor('month','February'));
check(root.dataset.month==='2030-02-01','month name');
var invalid=inputFor('month','13');sbDatepickerInputCommit(invalid);
check(invalid['aria-invalid']==='true' && root.dataset.month==='2030-02-01','invalid month preserves calendar');
root.dataset.max='2028-06-15';sbDatepickerInputCommit(inputFor('year','2035'));
check(root.dataset.month==='2028-06-01','manual input respects max');
print('Datepicker: manual input and bounds passed');

check(sbMkDatepicker({value:"2024-05-15"}).includes("sb-datepicker-popup-card"),"popup uses Context Card");
check(!sbMkDatepicker({inline:true}).includes("sb-datepicker-popup-card"),"inline has no popup surface");
