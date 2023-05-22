const movies = JSON.parse(document.querySelector('textarea').value).map(m => {
    m.title = m.name.replace(/(The|A) (.*)/, '$2, $1') + (m.year ? ` (${m.year})` : '');
    m.header = m.title.match(/^[^A-Z]/) ? '0-9' : m.title[0];
    return m;
}).sort((a, b) => a.title > b.title);

const mk = (tag, text, parent) => {
    const e = document.createElement(tag);
    e.innerText = text || '';
    (parent || document.body).appendChild(e);
    return e;
}

function onclick(elm, handler) {
    elm.classList.add('clickable');
    elm.addEventListener('click', handler);
}

const selected = document.querySelector('#selected');
function show(li) {
    const m = li.movie;
    selected.innerHTML = '';
    mk('b', m.title, mk('div', '', selected));
    const add = (key, allowFilter) => {
        const div = mk('div', '', selected);
        if (!key in m) return;
        const value = m[key];
        if (!value) return;
        mk('b', `${key}: `, div);
        if (value.forEach) {
            // multiple elements
            if (!allowFilter) {
                mk('span', value, div);
                return;
            }
            value.forEach((e, i) => {
                if (i > 0) mk('span', ', ', div);
                onclick(mk('span', e, div), () => filter(key, e));
            });
            return;
        }
        if (!allowFilter) {
            mk('span', value, div);
            return;
        }
        onclick(mk('span', value, div), () => filter(key, value));
    };
    add('name');
    add('year', (true));
    add('release-date');
    add('runtime');
    add('categories', true);
    add('director', true);
    add('writer', true);
    add('actors', true);
    add('storyline');

    selected.style.display = 'block';
}

function pick(ul) {
    const lis = Array.from(ul.querySelectorAll('li'));
    show(lis[Math.floor(Math.random() * lis.length)]);
}

const content = document.querySelector('#content');
function refresh(items, title) {
    selected.style.display = 'none';
    document.querySelector('h1').innerText = `${title} (${items.length})`;
    content.innerHTML = '';
    let list = null, lastHeader = null;
    items.forEach(m => {
        if (!list || lastHeader != m.header) {
            // new header
            const h2 = mk('h2', m.header, content);
            h2.id = m.header;
            const ul = mk('ul', '', content);
            lastHeader = m.header;
            onclick(h2, () => pick(ul));
            list = ul;
        }
        const li = mk('li', m.title, list);
        li.movie = m;
        onclick(li, (e) => show(e.target));
    });
}

function filter(key, value) {
    const filtered = movies.filter((m) => {
        const mval = m[key];
        if (!mval) return false;
        return mval.forEach ? mval.includes(value) : mval == value;
    });
    console.log(`total ${movies.length}, filtered ${filtered.length}`);
    refresh(filtered, `${key} "${value}"`);
}

refresh(movies, 'All movies');
onclick(document.querySelector('h1'), () => refresh(movies, 'All movies'));
