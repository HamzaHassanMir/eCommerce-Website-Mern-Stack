import React, { useState, useEffect } from "react";

const API = "http://localhost:5000/api";
const token = () => localStorage.getItem("token");

const req = async (path, options = {}) => {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token()}`,
      ...(options.headers || {}),
    },
  });
  if (!res.ok) throw new Error((await res.json()) || "Request failed");
  return res.json();
};

const Icon = ({ d, size = 16, stroke = "currentColor", fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ICONS = {
  plus:   "M12 5v14M5 12h14",
  edit:   "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:  "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  x:      "M18 6L6 18M6 6l12 12",
  check:  "M20 6L9 17l-5-5",
  pkg:    "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
  tag:    "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7h.01",
  layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  alert:  "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
  login:  "M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3",
  eye:    "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z",
  eyeoff: "M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22",
  user:   "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
};

const STATUS_COLORS = {
  pending:    "#F59E0B",
  processing: "#3B82F6",
  shipped:    "#8B5CF6",
  delivered:  "#10B981",
  cancelled:  "#EF4444",
};

const EMPTY_PRODUCT  = { name: "", price: "", description: "", image: "", stock: "", category: "" };
const EMPTY_CATEGORY = { name: "", description: "" };

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN GATE
// ─────────────────────────────────────────────────────────────────────────────
function LoginGate({ onLogin }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Both fields are required");
    setLoading(true);
    setError("");
    try {
      const res  = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data || "Invalid credentials"); return; }
      localStorage.setItem("token", data.token);
      onLogin();
    } catch {
      setError("Cannot reach server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: "100%", background: "#0E0E0E", border: "1px solid #2A2A2A",
    padding: "13px 14px", color: "#E8E2D9", fontFamily: "'Montserrat',sans-serif",
    fontSize: 12, letterSpacing: "0.04em", outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s",
  };
  const foc = e => (e.target.style.borderColor = "#C9A84C");
  const blr = e => (e.target.style.borderColor = "#2A2A2A");

  return (
    <div style={{ minHeight: "100vh", background: "#0E0E0E", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Montserrat',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Montserrat:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .login-btn:hover{background:#E2C97E!important}
      `}</style>

      <div style={{ width: "100%", maxWidth: 400, padding: "0 24px", animation: "fadeUp 0.5s ease" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 600, color: "#E8E2D9", letterSpacing: "0.1em" }}>
            Maison<span style={{ color: "#C9A84C" }}>.</span>
          </div>
          <div style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "#3A3530", marginTop: 6 }}>Admin Console</div>
          <div style={{ width: 36, height: 1, background: "#C9A84C", margin: "16px auto 0" }} />
        </div>

        <p style={{ fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "#C9A84C", marginBottom: 12, textAlign: "center" }}>Sign In to Continue</p>

        {error && (
          <div style={{ background: "#2A1010", border: "1px solid #5A1A1A", color: "#F87171", fontSize: 11, padding: "11px 14px", marginBottom: 20, letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon d={ICONS.alert} size={13} stroke="#F87171" />
            {error}
          </div>
        )}

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#4A4540", display: "block", marginBottom: 7 }}>Email Address</label>
            <input type="email" style={inp} placeholder="admin@example.com" value={email} onChange={e => setEmail(e.target.value)} onFocus={foc} onBlur={blr} />
          </div>

          <div>
            <label style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#4A4540", display: "block", marginBottom: 7 }}>Password</label>
            <div style={{ position: "relative" }}>
              <input type={showPwd ? "text" : "password"} style={{ ...inp, paddingRight: 44 }} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onFocus={foc} onBlur={blr} />
              <button type="button" onClick={() => setShowPwd(v => !v)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#4A4540", cursor: "pointer", padding: 0, display: "flex" }}>
                <Icon d={showPwd ? ICONS.eyeoff : ICONS.eye} size={15} />
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn"
            style={{ marginTop: 8, background: "#C9A84C", color: "#0E0E0E", border: "none", padding: "14px", fontFamily: "'Montserrat',sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, transition: "background 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <Icon d={ICONS.login} size={14} stroke="#0E0E0E" />
            {loading ? "Signing In…" : "Sign In"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 10, color: "#2A2520", letterSpacing: "0.06em", marginTop: 32 }}>
          Use the same account you registered with on the storefront
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [authed, setAuthed]           = useState(!!localStorage.getItem("token"));
  const [page, setPage]               = useState("products");
  const [products, setProducts]       = useState([]);
  const [orders, setOrders]           = useState([]);
  const [categories, setCategories]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [toast, setToast]             = useState(null);
  const [signOutConfirm, setSignOutConfirm] = useState(false);

  // product state
  const [prodForm, setProdForm]           = useState(EMPTY_PRODUCT);
  const [editProdId, setEditProdId]       = useState(null);
  const [prodPanel, setProdPanel]         = useState(false);
  const [deleteProdId, setDeleteProdId]   = useState(null);
  const [prodSearch, setProdSearch]       = useState("");

  // category state
  const [catForm, setCatForm]             = useState(EMPTY_CATEGORY);
  const [editCatIdx, setEditCatIdx]       = useState(null);
  const [catPanel, setCatPanel]           = useState(false);
  const [deleteCatIdx, setDeleteCatIdx]   = useState(null);

  // order state
  const [orderSearch, setOrderSearch]     = useState("");
  const [statusFilter, setStatusFilter]   = useState("all");
  const [expandOrder, setExpandOrder]     = useState(null);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  // ── sign out ───────────────────────────────────────────────────────────────
  const signOut = () => {
    localStorage.removeItem("token");
    setAuthed(false);
    setSignOutConfirm(false);
    showToast("Signed out successfully");
  };

  // ── load ───────────────────────────────────────────────────────────────────
  const loadProducts = async () => {
    try { setProducts(await req("/products")); }
    catch (e) { showToast(e.message, "error"); }
  };

  const loadOrders = async () => {
    try { setOrders(await req("/orders/all")); }
    catch (e) { showToast(e.message, "error"); }
  };

  const loadCategories = () => {
    const saved = localStorage.getItem("maison_categories");
    setCategories(saved ? JSON.parse(saved) : [
      { name: "Kurta",       description: "Traditional & modern kurtas" },
      { name: "Suit",        description: "Two and three piece suits" },
      { name: "Lawn",        description: "Printed & embroidered lawn" },
      { name: "Winter",      description: "Khaddar, shawls and winter wear" },
      { name: "Formal",      description: "Formal occasion wear" },
      { name: "Accessories", description: "Shawls, dupattas and more" },
    ]);
  };

  const saveCategories = (list) => {
    setCategories(list);
    localStorage.setItem("maison_categories", JSON.stringify(list));
  };

  useEffect(() => {
    if (!authed) return;
    (async () => {
      setLoading(true);
      await loadProducts();
      await loadOrders();
      loadCategories();
      setLoading(false);
    })();
  }, [authed]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── if not authed show login ───────────────────────────────────────────────
  if (!authed) return <LoginGate onLogin={() => setAuthed(true)} />;

  // ── product CRUD ───────────────────────────────────────────────────────────
  const openAddProd  = () => { setProdForm(EMPTY_PRODUCT); setEditProdId(null); setProdPanel(true); };
  const openEditProd = (p) => {
    setProdForm({ name: p.name, price: p.price, description: p.description || "", image: p.image || "", stock: p.stock ?? "", category: p.category || "" });
    setEditProdId(p._id); setProdPanel(true);
  };
  const saveProd = async () => {
    if (!prodForm.name.trim() || !prodForm.price) return showToast("Name and price required", "error");
    setSaving(true);
    try {
      const body = { ...prodForm, price: Number(prodForm.price), stock: Number(prodForm.stock) || 0 };
      if (editProdId) {
        const updated = await req(`/products/${editProdId}`, { method: "PUT", body: JSON.stringify(body) });
        setProducts(prev => prev.map(p => p._id === editProdId ? updated : p));
        showToast("Product updated");
      } else {
        const created = await req("/products", { method: "POST", body: JSON.stringify(body) });
        setProducts(prev => [created, ...prev]);
        showToast("Product added");
      }
      setProdPanel(false);
    } catch (e) { showToast(e.message, "error"); }
    finally { setSaving(false); }
  };
  const confirmDeleteProd = async () => {
    try {
      await req(`/products/${deleteProdId}`, { method: "DELETE" });
      setProducts(prev => prev.filter(p => p._id !== deleteProdId));
      showToast("Product deleted");
    } catch (e) { showToast(e.message, "error"); }
    finally { setDeleteProdId(null); }
  };

  // ── category CRUD ──────────────────────────────────────────────────────────
  const openAddCat  = () => { setCatForm(EMPTY_CATEGORY); setEditCatIdx(null); setCatPanel(true); };
  const openEditCat = (idx) => { setCatForm({ name: categories[idx].name, description: categories[idx].description || "" }); setEditCatIdx(idx); setCatPanel(true); };
  const saveCat = () => {
    if (!catForm.name.trim()) return showToast("Category name required", "error");
    const list = [...categories];
    if (editCatIdx !== null) { list[editCatIdx] = catForm; showToast("Category updated"); }
    else {
      if (list.find(c => c.name.toLowerCase() === catForm.name.toLowerCase())) return showToast("Category already exists", "error");
      list.unshift(catForm); showToast("Category added");
    }
    saveCategories(list); setCatPanel(false);
  };
  const confirmDeleteCat = () => {
    saveCategories(categories.filter((_, i) => i !== deleteCatIdx));
    setDeleteCatIdx(null); showToast("Category deleted");
  };

  // ── order status ───────────────────────────────────────────────────────────
  const updateOrderStatus = async (orderId, status) => {
    setUpdatingOrder(orderId);
    try {
      const updated = await req(`/orders/${orderId}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: updated.status } : o));
      showToast("Status updated");
    } catch (e) { showToast(e.message, "error"); }
    finally { setUpdatingOrder(null); }
  };

  // ── filtered ───────────────────────────────────────────────────────────────
  const filteredProds  = products.filter(p => p.name.toLowerCase().includes(prodSearch.toLowerCase()) || (p.category||"").toLowerCase().includes(prodSearch.toLowerCase()));
  const filteredOrders = orders.filter(o => {
    const ms = orderSearch === "" || o._id.includes(orderSearch) || (o.userId?.email||"").toLowerCase().includes(orderSearch.toLowerCase());
    const mf = statusFilter === "all" || o.status === statusFilter;
    return ms && mf;
  });

  // ── stats ──────────────────────────────────────────────────────────────────
  const totalValue  = products.reduce((s, p) => s + p.price * (p.stock||0), 0);
  const lowStock    = products.filter(p => (p.stock||0) < 5).length;
  const totalRev    = orders.filter(o => o.status !== "cancelled").reduce((s,o) => s+(o.totalAmount||0),0);
  const pendingOrds = orders.filter(o => o.status === "pending").length;

  // ── shared styles ──────────────────────────────────────────────────────────
  const s = {
    wrap:      { minHeight:"100vh", background:"#0E0E0E", color:"#E8E2D9", fontFamily:"'Montserrat',sans-serif", fontWeight:300, display:"flex" },
    sidebar:   { width:220, flexShrink:0, background:"#141414", borderRight:"1px solid #1E1E1E", padding:"32px 0", display:"flex", flexDirection:"column", position:"fixed", top:0, left:0, height:"100vh", zIndex:10 },
    sideTitle: { fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:600, letterSpacing:"0.1em", color:"#E8E2D9", padding:"0 24px 28px", borderBottom:"1px solid #1E1E1E", marginBottom:8 },
    gold:      { color:"#C9A84C" },
    main:      { marginLeft:220, padding:"40px 48px", flex:1, minHeight:"100vh" },
    pageTitle: { fontFamily:"'Cormorant Garamond',serif", fontSize:36, fontWeight:400, letterSpacing:"0.04em" },
    statsRow:  { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:32 },
    statCard:  { background:"#141414", border:"1px solid #1E1E1E", padding:"22px 24px", position:"relative", overflow:"hidden" },
    statLabel: { fontSize:9, letterSpacing:"0.22em", textTransform:"uppercase", color:"#4A4540", marginBottom:8 },
    statVal:   { fontFamily:"'Cormorant Garamond',serif", fontSize:32, fontWeight:400, letterSpacing:"0.04em" },
    toolbar:   { display:"flex", alignItems:"center", gap:12, marginBottom:20 },
    search:    { flex:1, background:"#141414", border:"1px solid #222", padding:"10px 14px", color:"#E8E2D9", fontFamily:"'Montserrat',sans-serif", fontSize:12, letterSpacing:"0.04em", outline:"none" },
    addBtn:    { display:"flex", alignItems:"center", gap:8, background:"#C9A84C", color:"#0E0E0E", border:"none", padding:"10px 22px", fontFamily:"'Montserrat',sans-serif", fontSize:11, fontWeight:600, letterSpacing:"0.14em", textTransform:"uppercase", cursor:"pointer" },
    table:     { width:"100%", borderCollapse:"collapse" },
    th:        { textAlign:"left", fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:"#3A3530", padding:"11px 14px", borderBottom:"1px solid #1E1E1E" },
    td:        { padding:"13px 14px", borderBottom:"1px solid #181818", fontSize:12, verticalAlign:"middle" },
    pill:      (clr) => ({ background:clr+"22", color:clr, fontSize:9, padding:"3px 8px", letterSpacing:"0.1em", textTransform:"uppercase", fontWeight:500, borderRadius:2, display:"inline-block" }),
    iconBtn:   (clr="#4A4540") => ({ background:"none", border:"none", cursor:"pointer", color:clr, padding:5, display:"inline-flex", alignItems:"center", transition:"color 0.2s" }),
    overlay:   { position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:40, backdropFilter:"blur(2px)" },
    drawer:    { position:"fixed", top:0, right:0, width:420, height:"100vh", background:"#141414", borderLeft:"1px solid #1E1E1E", zIndex:50, padding:"36px 32px", overflowY:"auto", display:"flex", flexDirection:"column", gap:18 },
    label:     { fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:"#4A4540", display:"block", marginBottom:6 },
    input:     { width:"100%", background:"#0E0E0E", border:"1px solid #222", padding:"11px 13px", color:"#E8E2D9", fontFamily:"'Montserrat',sans-serif", fontSize:12, letterSpacing:"0.04em", outline:"none", boxSizing:"border-box", transition:"border-color 0.2s" },
    textarea:  { width:"100%", background:"#0E0E0E", border:"1px solid #222", padding:"11px 13px", color:"#E8E2D9", fontFamily:"'Montserrat',sans-serif", fontSize:12, letterSpacing:"0.04em", outline:"none", resize:"vertical", minHeight:80, boxSizing:"border-box" },
    saveBtn:   { background:"#C9A84C", color:"#0E0E0E", border:"none", padding:"13px", fontFamily:"'Montserrat',sans-serif", fontSize:11, fontWeight:600, letterSpacing:"0.16em", textTransform:"uppercase", cursor:"pointer", flex:1 },
    cancelBtn: { background:"transparent", color:"#4A4540", border:"1px solid #222", padding:"12px", fontFamily:"'Montserrat',sans-serif", fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", cursor:"pointer", flex:1 },
    dialog:    { position:"fixed", inset:0, display:"flex", alignItems:"center", justifyContent:"center", zIndex:60 },
    dialogBox: { background:"#141414", border:"1px solid #222", padding:"32px 36px", maxWidth:340, width:"90%", textAlign:"center", position:"relative", zIndex:61, animation:"fadeIn 0.2s ease" },
    toastWrap: (t) => ({ position:"fixed", bottom:28, right:28, zIndex:99, padding:"13px 20px", fontFamily:"'Montserrat',sans-serif", fontSize:11, letterSpacing:"0.08em", display:"flex", alignItems:"center", gap:10, background:t==="error"?"#2A1010":"#0F1F0F", border:`1px solid ${t==="error"?"#5A1A1A":"#1A3A1A"}`, color:t==="error"?"#F87171":"#6EE7B7", animation:"slideUp 0.3s ease" }),
  };

  const foc = e => (e.target.style.borderColor = "#C9A84C");
  const blr = e => (e.target.style.borderColor = "#222");

  // ── nav item ───────────────────────────────────────────────────────────────
  const NavItem = ({ id, icon, label }) => {
    const active = page === id;
    return (
      <div onClick={() => setPage(id)}
        style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 24px", fontSize:11, letterSpacing:"0.14em", textTransform:"uppercase", cursor:"pointer", transition:"all 0.2s", borderLeft:active?"2px solid #C9A84C":"2px solid transparent", color:active?"#C9A84C":"#4A4540", background:active?"rgba(201,168,76,0.05)":"transparent" }}>
        <Icon d={icon} size={14} />
        {label}
        {id==="orders" && pendingOrds>0 && (
          <span style={{ marginLeft:"auto", background:"#F59E0B", color:"#0E0E0E", fontSize:9, fontWeight:700, padding:"1px 6px", borderRadius:2 }}>{pendingOrds}</span>
        )}
      </div>
    );
  };

  // ── delete dialog ──────────────────────────────────────────────────────────
  const DeleteDialog = ({ onConfirm, onCancel, message }) => (
    <div style={s.dialog}>
      <div style={s.overlay} onClick={onCancel} />
      <div style={s.dialogBox}>
        <div style={{ width:40, height:40, borderRadius:"50%", background:"#2A1010", border:"1px solid #5A1A1A", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
          <Icon d={ICONS.alert} size={18} stroke="#F87171" />
        </div>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, marginBottom:8, letterSpacing:"0.04em" }}>Confirm Delete</p>
        <p style={{ fontSize:11, color:"#4A4540", lineHeight:1.7, marginBottom:24, letterSpacing:"0.06em" }}>{message}</p>
        <div style={{ display:"flex", gap:10 }}>
          <button style={{ ...s.saveBtn, background:"#5A1A1A", color:"#F87171" }} onClick={onConfirm}>Delete</button>
          <button style={s.cancelBtn} onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // PRODUCTS PAGE
  // ══════════════════════════════════════════════════════════════════════════
  const ProductsPage = () => (
    <>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:32 }}>
        <div>
          <h1 style={s.pageTitle}>Product Catalogue</h1>
          <p style={{ fontSize:11, color:"#4A4540", letterSpacing:"0.08em", marginTop:4 }}>{products.length} items in collection</p>
        </div>
      </div>
      <div style={s.statsRow}>
        {[
          { label:"Total Products",  value:products.length,                        accent:"#C9A84C" },
          { label:"Inventory Value", value:`PKR ${(totalValue/1000).toFixed(0)}k`, accent:"#6EE7B7" },
          { label:"Low Stock",       value:lowStock,                               accent:lowStock>0?"#F87171":"#6EE7B7" },
          { label:"Categories",      value:categories.length,                      accent:"#8B5CF6" },
        ].map(({ label, value, accent }) => (
          <div key={label} style={s.statCard}>
            <div style={{ position:"absolute", top:0, left:0, width:3, height:"100%", background:accent }} />
            <div style={s.statLabel}>{label}</div>
            <div style={{ ...s.statVal, color:accent }}>{value}</div>
          </div>
        ))}
      </div>
      <div style={s.toolbar}>
        <input className="srch" style={s.search} placeholder="Search by name or category…" value={prodSearch} onChange={e => setProdSearch(e.target.value)} />
        <button className="addbtn" style={s.addBtn} onClick={openAddProd}><Icon d={ICONS.plus} size={14} stroke="#0E0E0E" /> Add Product</button>
      </div>
      {filteredProds.length === 0 ? (
        <div style={{ textAlign:"center", padding:"80px 0", color:"#4A4540" }}>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22 }}>{prodSearch?"No products match":"No products yet"}</p>
          <p style={{ fontSize:11, marginTop:8, letterSpacing:"0.08em" }}>Click Add Product to get started</p>
        </div>
      ) : (
        <table style={s.table}>
          <thead><tr>{["Product","Category","Price (PKR)","Stock","Actions"].map(h=><th key={h} style={s.th}>{h}</th>)}</tr></thead>
          <tbody>
            {filteredProds.map(p => (
              <tr key={p._id}>
                <td style={s.td}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:40, height:48, background:"#1A1A1A", flexShrink:0, overflow:"hidden" }}>
                      {p.image && <img src={p.image} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />}
                    </div>
                    <div>
                      <div style={{ fontWeight:500, color:"#E8E2D9", fontSize:13 }}>{p.name}</div>
                      <div style={{ fontSize:10, color:"#4A4540", marginTop:2, maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.description||"—"}</div>
                    </div>
                  </div>
                </td>
                <td style={s.td}><span style={s.pill("#C9A84C")}>{p.category||"—"}</span></td>
                <td style={{ ...s.td, fontFamily:"'Cormorant Garamond',serif", fontSize:18, color:"#C9A84C" }}>{p.price?.toLocaleString()}</td>
                <td style={s.td}><span style={s.pill((p.stock||0)<5?"#F87171":"#6EE7B7")}>{p.stock??0} units</span></td>
                <td style={s.td}>
                  <div style={{ display:"flex", gap:2 }}>
                    <button className="editbtn" style={s.iconBtn()} onClick={() => openEditProd(p)} title="Edit"><Icon d={ICONS.edit} size={15} /></button>
                    <button className="delbtn"  style={s.iconBtn()} onClick={() => setDeleteProdId(p._id)} title="Delete"><Icon d={ICONS.trash} size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {prodPanel && (
        <>
          <div style={{ ...s.overlay, animation:"fadeIn 0.2s ease" }} onClick={() => setProdPanel(false)} />
          <div style={s.drawer}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, fontWeight:400, letterSpacing:"0.04em" }}>{editProdId?"Edit Product":"New Product"}</h2>
                <p style={{ fontSize:10, color:"#4A4540", letterSpacing:"0.1em", marginTop:4 }}>{editProdId?"Update details below":"Fill in details to add"}</p>
              </div>
              <button style={s.iconBtn()} onClick={() => setProdPanel(false)}><Icon d={ICONS.x} size={18} /></button>
            </div>
            <div style={{ height:1, background:"#1E1E1E" }} />
            {prodForm.image && (
              <div style={{ height:160, overflow:"hidden", background:"#0E0E0E" }}>
                <img src={prodForm.image} alt="preview" style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e=>e.target.style.display="none"} />
              </div>
            )}
            {[
              { key:"name",     label:"Product Name *", type:"text",   ph:"e.g. Classic Linen Kurta" },
              { key:"price",    label:"Price (PKR) *",  type:"number", ph:"e.g. 4500" },
              { key:"stock",    label:"Stock Quantity", type:"number", ph:"e.g. 25" },
              { key:"category", label:"Category",       type:"text",   ph:categories.map(c=>c.name).join(", ")||"e.g. Kurta" },
              { key:"image",    label:"Image URL",      type:"text",   ph:"https://…" },
            ].map(({ key, label, type, ph }) => (
              <div key={key}>
                <label style={s.label}>{label}</label>
                <input type={type} style={s.input} placeholder={ph} value={prodForm[key]} onFocus={foc} onBlur={blr} onChange={e=>setProdForm({...prodForm,[key]:e.target.value})} />
              </div>
            ))}
            <div>
              <label style={s.label}>Description</label>
              <textarea style={s.textarea} placeholder="Brief product description…" value={prodForm.description} onFocus={foc} onBlur={blr} onChange={e=>setProdForm({...prodForm,description:e.target.value})} />
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button style={s.saveBtn} onClick={saveProd} disabled={saving}>{saving?"Saving…":editProdId?"Update Product":"Add to Catalogue"}</button>
              <button style={s.cancelBtn} onClick={() => setProdPanel(false)}>Cancel</button>
            </div>
          </div>
        </>
      )}
      {deleteProdId && <DeleteDialog message="This product will be permanently removed from your catalogue." onConfirm={confirmDeleteProd} onCancel={() => setDeleteProdId(null)} />}
    </>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // ORDERS PAGE
  // ══════════════════════════════════════════════════════════════════════════
  const OrdersPage = () => (
    <>
      <div style={{ marginBottom:32 }}>
        <h1 style={s.pageTitle}>Orders</h1>
        <p style={{ fontSize:11, color:"#4A4540", letterSpacing:"0.08em", marginTop:4 }}>{orders.length} total orders</p>
      </div>
      <div style={s.statsRow}>
        {[
          { label:"Total Revenue", value:`PKR ${(totalRev/1000).toFixed(0)}k`,                    accent:"#C9A84C" },
          { label:"Total Orders",  value:orders.length,                                             accent:"#6EE7B7" },
          { label:"Pending",       value:pendingOrds,                                               accent:"#F59E0B" },
          { label:"Delivered",     value:orders.filter(o=>o.status==="delivered").length,           accent:"#10B981" },
        ].map(({ label, value, accent }) => (
          <div key={label} style={s.statCard}>
            <div style={{ position:"absolute", top:0, left:0, width:3, height:"100%", background:accent }} />
            <div style={s.statLabel}>{label}</div>
            <div style={{ ...s.statVal, color:accent }}>{value}</div>
          </div>
        ))}
      </div>
      <div style={s.toolbar}>
        <input className="srch" style={s.search} placeholder="Search by order ID…" value={orderSearch} onChange={e=>setOrderSearch(e.target.value)} />
        <select style={{ background:"#141414", border:"1px solid #222", color:"#E8E2D9", fontFamily:"'Montserrat',sans-serif", fontSize:11, letterSpacing:"0.08em", padding:"10px 14px", outline:"none", cursor:"pointer", textTransform:"uppercase" }} value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          {Object.keys(STATUS_COLORS).map(s=><option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      {filteredOrders.length === 0 ? (
        <div style={{ textAlign:"center", padding:"80px 0", color:"#4A4540" }}>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22 }}>No orders found</p>
          <p style={{ fontSize:11, marginTop:8, letterSpacing:"0.08em" }}>Orders will appear here when customers place them</p>
        </div>
      ) : (
        <table style={s.table}>
          <thead><tr>{["Order ID","Date","Items","Total (PKR)","Status","Actions"].map(h=><th key={h} style={s.th}>{h}</th>)}</tr></thead>
          <tbody>
            {filteredOrders.map(o => (
              <React.Fragment key={o._id}>
                <tr>
                  <td style={s.td}><span style={{ fontSize:10, color:"#4A4540", letterSpacing:"0.06em" }}>#{o._id.slice(-8).toUpperCase()}</span></td>
                  <td style={s.td}><span style={{ fontSize:11, color:"#6B6560" }}>{new Date(o.createdAt).toLocaleDateString("en-PK",{day:"numeric",month:"short",year:"numeric"})}</span></td>
                  <td style={s.td}><span style={{ fontSize:12 }}>{(o.products||[]).length} item{(o.products||[]).length!==1?"s":""}</span></td>
                  <td style={{ ...s.td, fontFamily:"'Cormorant Garamond',serif", fontSize:18, color:"#C9A84C" }}>{(o.totalAmount||0).toLocaleString()}</td>
                  <td style={s.td}>
                    <select style={{ background:STATUS_COLORS[o.status]+"22", color:STATUS_COLORS[o.status], border:`1px solid ${STATUS_COLORS[o.status]}44`, fontFamily:"'Montserrat',sans-serif", fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase", fontWeight:600, padding:"4px 8px", outline:"none", cursor:"pointer", opacity:updatingOrder===o._id?0.5:1 }}
                      value={o.status} onChange={e=>updateOrderStatus(o._id,e.target.value)} disabled={updatingOrder===o._id}>
                      {Object.keys(STATUS_COLORS).map(st=><option key={st} value={st}>{st}</option>)}
                    </select>
                  </td>
                  <td style={s.td}>
                    <button style={s.iconBtn(expandOrder===o._id?"#C9A84C":undefined)} onClick={()=>setExpandOrder(expandOrder===o._id?null:o._id)} title="View items"><Icon d={ICONS.eye} size={15} /></button>
                  </td>
                </tr>
                {expandOrder===o._id && (
                  <tr>
                    <td colSpan={6} style={{ ...s.td, background:"#111", padding:"16px 20px" }}>
                      <p style={{ fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:"#4A4540", marginBottom:10 }}>Order Items</p>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
                        {(o.products||[]).map((item,i)=>(
                          <div key={i} style={{ display:"flex", alignItems:"center", gap:10, background:"#141414", border:"1px solid #1E1E1E", padding:"10px 14px", minWidth:200 }}>
                            {item.image && <img src={item.image} alt={item.name} style={{ width:32, height:40, objectFit:"cover" }} />}
                            <div>
                              <div style={{ fontSize:12, color:"#E8E2D9", fontWeight:500 }}>{item.name||"Product"}</div>
                              <div style={{ fontSize:10, color:"#4A4540", marginTop:2 }}>PKR {(item.price||0).toLocaleString()} × {item.quantity||1}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // CATEGORIES PAGE
  // ══════════════════════════════════════════════════════════════════════════
  const CategoriesPage = () => (
    <>
      <div style={{ marginBottom:32 }}>
        <h1 style={s.pageTitle}>Categories</h1>
        <p style={{ fontSize:11, color:"#4A4540", letterSpacing:"0.08em", marginTop:4 }}>{categories.length} categories</p>
      </div>
      <div style={s.toolbar}>
        <div style={{ flex:1 }} />
        <button className="addbtn" style={s.addBtn} onClick={openAddCat}><Icon d={ICONS.plus} size={14} stroke="#0E0E0E" /> New Category</button>
      </div>
      {categories.length === 0 ? (
        <div style={{ textAlign:"center", padding:"80px 0", color:"#4A4540" }}>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22 }}>No categories yet</p>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:16 }}>
          {categories.map((cat, idx) => {
            const count = products.filter(p=>p.category===cat.name).length;
            return (
              <div key={idx} style={{ background:"#141414", border:"1px solid #1E1E1E", padding:"24px", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, width:3, height:"100%", background:"#C9A84C" }} />
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div>
                    <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:400, color:"#E8E2D9", letterSpacing:"0.04em", marginBottom:6 }}>{cat.name}</p>
                    <p style={{ fontSize:11, color:"#4A4540", letterSpacing:"0.04em", lineHeight:1.6 }}>{cat.description||"No description"}</p>
                  </div>
                  <div style={{ display:"flex", gap:2, flexShrink:0 }}>
                    <button className="editbtn" style={s.iconBtn()} onClick={() => openEditCat(idx)}><Icon d={ICONS.edit} size={14} /></button>
                    <button className="delbtn"  style={s.iconBtn()} onClick={() => setDeleteCatIdx(idx)}><Icon d={ICONS.trash} size={14} /></button>
                  </div>
                </div>
                <div style={{ marginTop:16, borderTop:"1px solid #1E1E1E", paddingTop:12 }}>
                  <span style={s.pill("#C9A84C")}>{count} product{count!==1?"s":""}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {catPanel && (
        <>
          <div style={{ ...s.overlay, animation:"fadeIn 0.2s ease" }} onClick={() => setCatPanel(false)} />
          <div style={{ ...s.drawer, width:360 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, fontWeight:400, letterSpacing:"0.04em" }}>{editCatIdx!==null?"Edit Category":"New Category"}</h2>
              <button style={s.iconBtn()} onClick={() => setCatPanel(false)}><Icon d={ICONS.x} size={18} /></button>
            </div>
            <div style={{ height:1, background:"#1E1E1E" }} />
            <div>
              <label style={s.label}>Category Name *</label>
              <input type="text" style={s.input} placeholder="e.g. Kurta" value={catForm.name} onFocus={foc} onBlur={blr} onChange={e=>setCatForm({...catForm,name:e.target.value})} />
            </div>
            <div>
              <label style={s.label}>Description</label>
              <textarea style={s.textarea} placeholder="Brief description…" value={catForm.description} onFocus={foc} onBlur={blr} onChange={e=>setCatForm({...catForm,description:e.target.value})} />
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button style={s.saveBtn} onClick={saveCat}>{editCatIdx!==null?"Update":"Add Category"}</button>
              <button style={s.cancelBtn} onClick={() => setCatPanel(false)}>Cancel</button>
            </div>
          </div>
        </>
      )}
      {deleteCatIdx!==null && <DeleteDialog message="This category will be removed. Products assigned to it will not be deleted." onConfirm={confirmDeleteCat} onCancel={() => setDeleteCatIdx(null)} />}
    </>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div style={s.wrap}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Montserrat:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#0E0E0E}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#141414}
        ::-webkit-scrollbar-thumb{background:#2A2A2A}
        @keyframes slideUp{from{transform:translateY(12px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        tr:hover td{background:rgba(255,255,255,0.012)!important}
        .addbtn:hover{background:#E2C97E!important}
        .srch:focus{border-color:#C9A84C!important;outline:none}
        .editbtn:hover{color:#C9A84C!important}
        .delbtn:hover{color:#EF4444!important}
        .signout-btn:hover{color:#F87171!important}
      `}</style>

      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.sideTitle}>
          Mir's<span style={s.gold}>.</span>
          <div style={{ fontSize:9, letterSpacing:"0.2em", color:"#3A3530", textTransform:"uppercase", marginTop:4, fontWeight:400 }}>Admin Console</div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:2, marginTop:4 }}>
          <NavItem id="products"   icon={ICONS.layers} label="Products" />
          <NavItem id="orders"     icon={ICONS.pkg}    label="Orders" />
          <NavItem id="categories" icon={ICONS.tag}    label="Categories" />
        </div>
        <div style={{ flex:1 }} />
        {/* Sign Out */}
        <div style={{ padding:"0 16px 24px" }}>
          <div style={{ height:1, background:"#1E1E1E", marginBottom:12 }} />
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 8px", marginBottom:4 }}>
            <div style={{ width:30, height:30, borderRadius:"50%", background:"#1E1E1E", border:"1px solid #2A2A2A", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon d={ICONS.user} size={13} stroke="#C9A84C" />
            </div>
            <div>
              <div style={{ fontSize:10, color:"#E8E2D9", letterSpacing:"0.06em", fontWeight:500 }}>Admin</div>
              <div style={{ fontSize:9, color:"#3A3530", letterSpacing:"0.06em" }}>Logged in</div>
            </div>
          </div>
          <button
            className="signout-btn"
            onClick={() => setSignOutConfirm(true)}
            style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"10px 8px", fontSize:11, letterSpacing:"0.14em", textTransform:"uppercase", color:"#4A4540", background:"none", border:"none", cursor:"pointer", transition:"color 0.2s" }}
          >
            <Icon d={ICONS.logout} size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={s.main}>
        {loading ? (
          <div style={{ textAlign:"center", paddingTop:120, color:"#4A4540", fontSize:13, letterSpacing:"0.1em" }}>Loading…</div>
        ) : (
          <>
            {page==="products"   && <ProductsPage />}
            {page==="orders"     && <OrdersPage />}
            {page==="categories" && <CategoriesPage />}
          </>
        )}
      </main>

      {/* Sign Out Confirm */}
      {signOutConfirm && (
        <div style={s.dialog}>
          <div style={s.overlay} onClick={() => setSignOutConfirm(false)} />
          <div style={s.dialogBox}>
            <div style={{ width:40, height:40, borderRadius:"50%", background:"#1A1A2A", border:"1px solid #2A2A4A", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
              <Icon d={ICONS.logout} size={18} stroke="#8B9CF6" />
            </div>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, marginBottom:8, letterSpacing:"0.04em" }}>Sign Out?</p>
            <p style={{ fontSize:11, color:"#4A4540", lineHeight:1.7, marginBottom:24, letterSpacing:"0.06em" }}>You will be returned to the login screen.</p>
            <div style={{ display:"flex", gap:10 }}>
              <button style={{ ...s.saveBtn, background:"#1A1A2A", color:"#8B9CF6", border:"1px solid #2A2A4A" }} onClick={signOut}>Sign Out</button>
              <button style={s.cancelBtn} onClick={() => setSignOutConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={s.toastWrap(toast.type)}>
          <Icon d={toast.type==="error"?ICONS.alert:ICONS.check} size={14} stroke={toast.type==="error"?"#F87171":"#6EE7B7"} />
          {toast.msg}
        </div>
      )}
    </div>
  );
}