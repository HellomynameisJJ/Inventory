const SECRET = { user: 'Julio2025', pass: 'Davalos' };
const DATA_KEY = 'jj_data';
const SALES_KEY = 'jj_sales';
const CD_KEY = 'clientes_deudas_v1';

let movements = JSON.parse(localStorage.getItem(DATA_KEY)) || [];
let sales = JSON.parse(localStorage.getItem(SALES_KEY)) || [];

/* helpers */
const $ = id => document.getElementById(id);
const now = () => new Date().toLocaleString();

/* LOGIN */
function handleLogin() {
  if ($('userInput').value === SECRET.user &&
      $('passInput').value === SECRET.pass) {
    $('loginCard').style.display = 'none';
    $('panelCard').classList.remove('hidden');
  } else {
    $('loginErr').textContent = 'Credenciales incorrectas';
  }
}

function handleLogout() {
  location.reload();
}

/* INVENTARIO */
function addMovement() {
  const prod = $('prodSelect').value;
  const qty = +$('qtyInput').value;
  const price = +$('priceInput').value;

  if (!prod || qty <= 0 || price <= 0) return;

  movements.push({
    id: Date.now(),
    producto: prod,
    cantidad: qty,
    total: qty * price,
    fecha: now()
  });

  localStorage.setItem(DATA_KEY, JSON.stringify(movements));
  renderInv();
}

function renderInv() {
  $('movBody').innerHTML = '';
  movements.forEach(m => {
    $('movBody').innerHTML += `
      <tr>
        <td>${m.producto}</td>
        <td>${m.cantidad}</td>
        <td>S/ ${m.total.toFixed(2)}</td>
        <td>${m.fecha}</td>
        <td><button class="btn-small btn-danger" onclick="delInv(${m.id})">X</button></td>
      </tr>`;
  });
}

function delInv(id) {
  movements = movements.filter(m => m.id !== id);
  localStorage.setItem(DATA_KEY, JSON.stringify(movements));
  renderInv();
}

/* CLIENTES */
function cd_get() {
  return JSON.parse(localStorage.getItem(CD_KEY) || '[]');
}

function cd_set(d) {
  localStorage.setItem(CD_KEY, JSON.stringify(d));
}

function cd_render() {
  const body = $('cd_body');
  body.innerHTML = '';

  cd_get().forEach((c, i) => {
    body.innerHTML += `
      <tr>
        <td contenteditable>${c.name}</td>
        <td contenteditable>${c.detail}</td>
        <td contenteditable>${c.debt}</td>
        <td>${c.date}</td>
        <td><button class="btn-small btn-danger" onclick="cd_del(${i})">X</button></td>
      </tr>`;
  });
}

function cd_add() {
  const data = cd_get();
  data.push({
    name: $('cd_name').value,
    detail: $('cd_detail').value,
    debt: $('cd_debt').value,
    date: now()
  });
  cd_set(data);
  cd_render();
}

function cd_del(i) {
  const data = cd_get();
  data.splice(i,1);
  cd_set(data);
  cd_render();
}

document.getElementById('cd_add').onclick = cd_add;
cd_render();
renderInv();
