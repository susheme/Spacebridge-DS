// ═══════════════════════════════════════════════════════════════════════════
// DATEPICKER — CSS в css/components/datepicker.css; SYNC-маркеры обязательны.
// ═══════════════════════════════════════════════════════════════════════════
window.COMP_CSS.datepicker = `.sb-datepicker-calendar {
  padding: var(--pad-vert-16) var(--pad-horiz-16);
  border: var(--border-width-1) solid var(--border);
  border-radius: var(--radius-8);
  background: var(--background);
  color: var(--text-primary);
  width: calc(var(--text-field-min-width) * 2 + var(--btn-rounded-max-width-s) * 2 + var(--gap-horiz-xs) * 3 + var(--pad-horiz-16) * 2);
  max-width: 100%;
}
.sb-datepicker-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--gap-horiz-xs);
  margin-bottom: var(--gap-vert-s);
}
.sb-datepicker-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: var(--gap-horiz-xxs);
}
.sb-datepicker-weekday {
  text-align: center;
  color: var(--text-secondary);
}
.sb-datepicker-select { flex: 1; min-width: 0; }
.sb-datepicker-select .sb-sel-pop,
.sb-datepicker-select .sb-sel { min-width: 0; width: 100%; }
.sb-datepicker-day.sb-btn { min-width: 0; justify-self: center; }
.sb-datepicker-day.sb-btn-text { color: var(--text-primary); }
.sb-datepicker-weekday { padding: var(--pad-vert-8) var(--pad-horiz-0); color: var(--text-primary); }
.sb-datepicker-weekday.is-weekend,
.sb-datepicker-day.sb-btn-text.is-weekend { color: var(--info); }
.sb-datepicker-day.sb-btn-text.is-outside { color: var(--text-secondary); }
.sb-datepicker-menu .sb-ctx-card { max-height: calc(var(--text-field-height-l) * 6); overflow-y: auto; overscroll-behavior: contain; }
.sb-datepicker-select input[aria-invalid="true"] { color: var(--error); }
/* The existing Context Card owns the popup surface and shadow. */
.sb-datepicker-popup-card.sb-ctx-card { padding: var(--pad-vert-0) var(--pad-horiz-0); gap: var(--gap-vert-0); min-width: 0; max-width: 100%; }
.sb-datepicker-popup-card > .sb-datepicker-calendar { border: none; border-radius: inherit; }
`;
(() => {
  let uid = 0;
  const months = {
    en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    ru: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь']
  };
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'); }
  function parse(s) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s || '')) return null;
    const p=s.split('-').map(Number), d=new Date(p[0],p[1]-1,p[2]);
    return iso(d)===s ? d : null;
  }
  function attr(s) { return String(s || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;'); }
  function calendar(o) {
    const d=parse(o.month) || parse(o.value) || new Date();
    const year=d.getFullYear(), month=d.getMonth(), locale=o.locale==='ru'?'ru':'en';
    const first=new Date(year,month,1), offset=(first.getDay()+6)%7;
    const names=locale==='ru'?['Пн','Вт','Ср','Чт','Пт','Сб','Вс']:['Mo','Tu','We','Th','Fr','Sa','Su'];
    let cells=names.map((n,i)=>'<span class="sb-datepicker-weekday sb-body-m'+(i>4?' is-weekend':'')+'">'+n+'</span>').join('');
    for(let i=0;i<42;i++) {
      const date=new Date(year,month,i-offset+1), value=iso(date), outside=date.getMonth()!==month;
      cells+=sbMkButton({ size:'s', iconOnly:true, content:String(date.getDate()),
        variant:value===o.value?'primary':'text', disabled:!!o.disabled || !!(o.min && value<o.min) || !!(o.max && value>o.max),
        cls:'sb-datepicker-day'+(outside?' is-outside':i%7>4?' is-weekend':''),
        attrs:'data-date="'+value+'" aria-label="'+value+'" aria-pressed="'+(value===o.value)+'"' });
    }
    function selector(part, value, options) {
      const label=locale==='ru'?(part==='year'?'Год':'Месяц'):(part==='year'?'Year':'Month');
      const input='<input class="sb-sel-val sb-tf-input" data-calendar-input="'+part+'" aria-label="'+label+'" value="'+attr(value)+'"'+(o.disabled?' disabled':'')+(part==='year'?' inputmode="numeric"':'')+' onclick="event.stopPropagation()" onkeydown="sbDatepickerInputKey(event)" onchange="sbDatepickerInputCommit(this)">';
      const select=sbMkSel({value,options,disabled:!!o.disabled,fieldMode:true})
        .replace(/<span class="sb-sel-val">[^<]*<\/span>/,input)
        .replace('sb-sel-panel','sb-sel-panel sb-datepicker-menu')
        .replace('data-placement=', 'data-on-open="sbDatepickerMenuOpen" data-placement=');
      return '<div class="sb-datepicker-select" data-calendar-part="'+part+'">'+select+'</div>';
    }
    const firstYear=o.min?parse(o.min).getFullYear():year-100;
    const lastYear=o.max?parse(o.max).getFullYear():year+100;
    const years=Array.from({length:lastYear-firstYear+1},(_,i)=>String(firstYear+i));
    const prev=iso(new Date(year,month,0)), next=iso(new Date(year,month+1,1));
    function arrow(delta, icon, label, disabled) { return sbMkButton({size:'s',icon,iconSize:'S',disabled:!!o.disabled||disabled,attrs:'data-month-step="'+delta+'" aria-label="'+label+'"'}); }
    return '<div class="sb-datepicker-heading">'+arrow(-1,'arrow-drop-left-line',locale==='ru'?'Предыдущий месяц':'Previous month',!!(o.min&&prev<o.min))
      +selector('month',months[locale][month],months[locale])+selector('year',String(year),years)
      +arrow(1,'arrow-drop-right-line',locale==='ru'?'Следующий месяц':'Next month',!!(o.max&&next>o.max))+'</div>'
      +'<div class="sb-datepicker-grid" role="group" aria-label="'+(locale==='ru'?'Дни месяца':'Days of month')+'">'+cells+'</div>';
  }
  function mk(o={}) {
    const id='sb-datepicker-'+(++uid), value=parse(o.value)?o.value:'';
    const opts={...o,value,min:parse(o.min)?o.min:'',max:parse(o.max)?o.max:''};
    const start=parse(value)||new Date();
    if(opts.min && iso(start)<opts.min) start.setTime(parse(opts.min).getTime());
    if(opts.max && iso(start)>opts.max) start.setTime(parse(opts.max).getTime());
    const month=iso(new Date(start.getFullYear(),start.getMonth(),1));
    const content='<div class="sb-datepicker-calendar" data-datepicker="'+id+'" data-value="'+value+'" data-month="'+month+'" data-min="'+opts.min+'" data-max="'+opts.max+'" data-locale="'+(o.locale==='ru'?'ru':'en')+'" data-disabled="'+!!o.disabled+'">'+calendar({...opts,month})+'</div>';
    if(o.inline) return content;
    return sbMkPopover({id:id+'-popover',closeOnSelect:false,trigger:sbMkButton({label:value||(o.locale==='ru'?'Выбрать дату':'Choose date'),disabled:!!o.disabled,attrs:'data-datepicker-trigger="'+id+'" aria-label="'+attr(o.label || (o.locale==='ru'?'Выбрать дату':'Choose date'))+'"'}),content:sbMkContextCard(content,{cls:'sb-datepicker-popup-card'})});
  }
  window.sbMkDatepicker=mk;
  document.addEventListener('click',function(ev){
    const btn=ev.target.closest('[data-date], [data-month-step]');
    if(!btn || btn.disabled) return;
    const root=btn.closest('[data-datepicker]'); if(!root || root.dataset.disabled==='true') return;
    const o={...root.dataset,disabled:root.dataset.disabled==='true'}, chosen=btn.getAttribute('data-date');
    if(chosen) {
      if(!parse(chosen) || (o.min && chosen<o.min) || (o.max && chosen>o.max)) return;
      o.value=chosen; root.dataset.value=chosen;
      o.month=chosen.slice(0,7)+'-01'; root.dataset.month=o.month;
      const trigger=document.querySelector('[data-datepicker-trigger="'+root.dataset.datepicker+'"]');
      if(trigger) trigger.textContent=chosen;
      root.dispatchEvent(new CustomEvent('sb-date-change',{bubbles:true,detail:{value:chosen}}));
    } else {
      const d=parse(o.month); d.setDate(1); d.setMonth(d.getMonth()+Number(btn.getAttribute('data-month-step')),1);
      o.month=iso(d); root.dataset.month=o.month;
    }
    root.innerHTML=calendar(o);
    const focus=root.querySelector(chosen?'[data-date="'+chosen+'"]':'[data-month-step="'+btn.getAttribute('data-month-step')+'"]');
    if(focus) focus.focus();
    if(chosen && root.closest('.sb-popover')) sbPopoverClose(root.closest('.sb-popover'));
  });
  document.addEventListener('click', function(ev) {
    const cell=ev.target.closest('.sb-sel-panel .sb-ctx-cell');
    if(!cell) return;
    const panel=cell.closest('.sb-popover');
    const wrap=document.querySelector('[data-sel="'+panel.id.replace('sb-sel-pop-','')+'"]');
    const slot=wrap && wrap.closest('[data-calendar-part]');
    const root=slot && slot.closest('[data-datepicker]');
    if(!root || root.dataset.disabled==='true') return;
    const o={...root.dataset,disabled:false}, d=parse(o.month);
    const label=cell.querySelector('.sb-ctx-cell-label').textContent.trim();
    if(slot.dataset.calendarPart==='month') d.setMonth(months[o.locale].indexOf(label),1);
    else d.setFullYear(Number(label));
    if(o.min && iso(d)<o.min) d.setTime(parse(o.min).getTime());
    if(o.max && iso(d)>o.max) d.setTime(parse(o.max).getTime());
    d.setDate(1); o.month=iso(d); root.dataset.month=o.month;
    sbPopoverClose(panel);
    root.innerHTML=calendar(o);
    const focus=root.querySelector('[data-calendar-part="'+slot.dataset.calendarPart+'"] input');
    if(focus) focus.focus();
  });
  window.sbDatepickerMenuOpen=function(panel, anchor) {
    const r=anchor.getBoundingClientRect();
    // Keep the menu on one side of the field, even in a short viewport.
    const available=Math.max(r.top,document.documentElement.clientHeight-r.bottom)-24;
    const card=panel.querySelector('.sb-ctx-card');
    const rowHeight=parseFloat(getComputedStyle(anchor).getPropertyValue('--text-field-height-l'));
    if(card) card.style.maxHeight=Math.max(0,Math.min(available,rowHeight*6))+'px';
    requestAnimationFrame(function(){
      const selected=panel.querySelector('.sb-ctx-cell.selected, .sb-ctx-cell.is-selected');
      if(selected) selected.scrollIntoView({block:'nearest'});
    });
  };
  window.sbDatepickerInputCommit=function(input) {
    const root=input.closest('[data-datepicker]');
    if(!root || root.dataset.disabled==='true') return;
    const o={...root.dataset,disabled:false}, d=parse(o.month), part=input.dataset.calendarInput;
    const text=input.value.trim().toLowerCase();
    let n;
    if(part==='year') n=/^\d{4}$/.test(text)?Number(text):NaN;
    else {
      n=/^\d{1,2}$/.test(text)?Number(text)-1:months[o.locale].findIndex(m=>m.toLowerCase()===text);
    }
    if(!Number.isInteger(n) || (part==='year'?(n<100 || n>9999):(n<0 || n>11))) {
      input.setAttribute('aria-invalid','true'); return;
    }
    if(part==='year') d.setFullYear(n); else d.setMonth(n,1);
    if(o.min && iso(d)<o.min) d.setTime(parse(o.min).getTime());
    if(o.max && iso(d)>o.max) d.setTime(parse(o.max).getTime());
    d.setDate(1); o.month=iso(d); root.dataset.month=o.month;
    const wrap=input.closest('.sb-sel-pop');
    const panel=wrap && (wrap._sbPop || wrap.querySelector('.sb-popover'));
    if(panel) sbPopoverClose(panel);
    root.innerHTML=calendar(o);
    const replacement=root.querySelector('[data-calendar-input="'+part+'"]');
    if(replacement) replacement.focus();
  };
  window.sbDatepickerInputKey=function(ev) {
    ev.stopPropagation();
    if(ev.key==='Enter') { ev.preventDefault(); sbDatepickerInputCommit(ev.target); }
    if(ev.key==='ArrowDown') {
      ev.preventDefault();
      const wrap=ev.target.closest('.sb-sel-pop');
      if(wrap) sbPopoverOpen(wrap._sbPop || wrap.querySelector('.sb-popover'),wrap,{focus:false});
    }
    if(ev.key==='Escape') {
      const root=ev.target.closest('[data-datepicker]'), d=parse(root.dataset.month);
      ev.target.value=ev.target.dataset.calendarInput==='year'?d.getFullYear():months[root.dataset.locale][d.getMonth()];
      ev.target.removeAttribute('aria-invalid');
      const wrap=ev.target.closest('.sb-sel-pop');
      if(wrap) sbPopoverClose(wrap._sbPop || wrap.querySelector('.sb-popover'));
    }
  };
  sbRegister({name:'datepicker',title:'Datepicker / Calendar',description:sbT('Select one date. Weeks start on Monday.','Выбор одной даты. Неделя начинается с понедельника.'),
    playground:{state:{inline:true,disabled:false,ru:false},controls(pg){return '<div class="pg-toggles">'+pg.toggle('inline','Inline')+pg.toggle('disabled','Disabled')+pg.toggle('ru','RU')+'</div>';},
      render(s){return mk({inline:s.inline,disabled:s.disabled,locale:s.ru?'ru':'en'});},
      genCode(s){return {html:mk({inline:s.inline,disabled:s.disabled,locale:s.ru?'ru':'en'}),css:COMP_CSS.buttons+'\n'+COMP_CSS.popover+'\n'+COMP_CSS.selector+'\n'+COMP_CSS['input-field']+'\n'+COMP_CSS.chevron+'\n'+COMP_CSS.contextMenu+'\n'+COMP_CSS.datepicker};}}
  });
})();
