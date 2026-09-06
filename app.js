let mode = "login";
let deferredPrompt = null;
const ADMIN_USER = "ditzzy";
const ADMIN_PASS = "ditzzy123";
const DANA = "085960162554";

function users(){ return JSON.parse(localStorage.getItem("clound_users") || "[]"); }
function saveUsers(v){ localStorage.setItem("clound_users", JSON.stringify(v)); }

function showAuth(type){
  mode=type;
  document.getElementById("authModal").classList.remove("hidden");
  document.getElementById("authMessage").textContent="";
  document.getElementById("authForm").reset();
  const title=document.getElementById("authTitle");
  const hint=document.getElementById("regHint");
  if(type==="register"){
    title.textContent="Registrasi User";
    hint.textContent="Buat akun pelanggan. Akun user terpisah dari akun admin.";
  }else if(type==="admin"){
    title.textContent="Login Admin";
    hint.textContent="Khusus administrator CLOUND MARKET.";
  }else{
    title.textContent="Login User";
    hint.textContent="Login menggunakan akun yang sudah didaftarkan.";
  }
}
function closeAuth(){document.getElementById("authModal").classList.add("hidden");}

document.getElementById("authForm").addEventListener("submit",function(e){
  e.preventDefault();
  const u=document.getElementById("username").value.trim();
  const p=document.getElementById("password").value;
  const msg=document.getElementById("authMessage");

  if(mode==="register"){
    if(u.toLowerCase()===ADMIN_USER){msg.textContent="Username tersebut khusus admin.";return;}
    if(u.length<3 || p.length<4){msg.textContent="Username minimal 3 karakter dan password minimal 4 karakter.";return;}
    const list=users();
    if(list.some(x=>x.username.toLowerCase()===u.toLowerCase())){msg.textContent="Username sudah digunakan.";return;}
    list.push({username:u,password:p});
    saveUsers(list);
    msg.textContent="Registrasi berhasil. Silakan login sebagai user.";
    setTimeout(()=>showAuth("login"),700);
    return;
  }

  if(mode==="admin"){
    if(u.toLowerCase()===ADMIN_USER && p.toLowerCase()==="ditzzy123"){
      localStorage.setItem("clound_session",JSON.stringify({role:"admin",username:"Ditzzy"}));
      closeAuth(); renderAccount(); alert("Login admin berhasil.");
    }else msg.textContent="Username atau password admin salah.";
    return;
  }

  const found=users().find(x=>x.username.toLowerCase()===u.toLowerCase() && x.password===p);
  if(found){
    localStorage.setItem("clound_session",JSON.stringify({role:"user",username:found.username}));
    closeAuth(); renderAccount(); alert("Login user berhasil.");
  }else msg.textContent="Akun user tidak ditemukan atau password salah.";
});

function renderAccount(){
  const s=JSON.parse(localStorage.getItem("clound_session")||"null");
  const area=document.getElementById("accountArea");
  if(!s){
    area.innerHTML='<p>Belum login.</p><button class="btn" onclick="showAuth(\'login\')">Login</button><button class="btn secondary" onclick="showAuth(\'register\')">Registrasi User</button><button class="btn admin" onclick="showAuth(\'admin\')">Login Admin</button>';
    return;
  }
  if(s.role==="admin"){
    area.innerHTML=`<p>👑 Login sebagai <b>ADMIN ${escapeHtml(s.username)}</b></p><button class="btn" onclick="adminDashboard()">🛠️ Dashboard Admin</button><button class="btn secondary" onclick="logout()">Logout</button>`;
  }else{
    area.innerHTML=`<p>👤 Login sebagai <b>${escapeHtml(s.username)}</b></p><button class="btn" onclick="userDashboard()">📦 Dashboard User</button><button class="btn secondary" onclick="logout()">Logout</button>`;
  }
}
function adminDashboard(){
  const count=users().length;
  alert(`DASHBOARD ADMIN CLOUND MARKET\\n\\nUser terdaftar: ${count}\\n\\nCatatan: ini dashboard front-end demo. Untuk admin sungguhan dan pengelolaan server, gunakan backend/Pterodactyl.`);
}
function userDashboard(){
  const s=JSON.parse(localStorage.getItem("clound_session")||"{}");
  alert(`DASHBOARD USER\\n\\nHalo ${s.username}!\\nPilih produk lalu tekan Order untuk memesan.`);
}
function logout(){localStorage.removeItem("clound_session");renderAccount();}
function order(product){
  const text=encodeURIComponent(`Halo CLOUND MARKET, saya ingin order ${product}. Nomor DANA: ${DANA}. Mohon info pembayaran dan aktivasi.`);
  window.open(`https://wa.me/6285960162554?text=${text}`,"_blank");
}
function copyDana(){
  navigator.clipboard?.writeText(DANA).then(()=>document.getElementById("copyStatus").textContent="Nomor DANA berhasil disalin.").catch(()=>document.getElementById("copyStatus").textContent=DANA);
}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}

window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;document.getElementById("installBtn").hidden=false;});
document.getElementById("installBtn").addEventListener("click",async()=>{
  if(!deferredPrompt)return;
  deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt=null;
  document.getElementById("installBtn").hidden=true;
});
document.getElementById("year").textContent=new Date().getFullYear();
renderAccount();