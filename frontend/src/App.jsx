import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { LayoutDashboard, ShieldAlert, CreditCard, BrainCircuit, Bell, Search } from "lucide-react";
import "./App.css";

const fraudTrend = [
  { month: "Jan", frauds: 820 },
  { month: "Fev", frauds: 910 },
  { month: "Mar", frauds: 1020 },
  { month: "Abr", frauds: 980 },
  { month: "Mai", frauds: 1180 },
  { month: "Jun", frauds: 1260 },
  { month: "Jul", frauds: 1390 },
  { month: "Ago", frauds: 1460 },
  { month: "Set", frauds: 1340 },
  { month: "Out", frauds: 1520 },
  { month: "Nov", frauds: 1650 },
  { month: "Dez", frauds: 1750 },
];

const categoryData = [
  { name: "grocery_pos", value: 1743 },
  { name: "shopping_net", value: 1713 },
  { name: "misc_net", value: 618 },
  { name: "shopping_pos", value: 512 },
  { name: "gas_transport", value: 478 },
  { name: "misc_pos", value: 430 },
  { name: "kids_pets", value: 398 },
  { name: "entertainment", value: 355 },
  { name: "personal_care", value: 312 },
  { name: "home", value: 280 },
];

const topMerchants = [
  { merchant: "Mercado Alpha", frauds: 212, value: "R$ 342.190" },
  { merchant: "Net Store", frauds: 198, value: "R$ 312.430" },
  { merchant: "TransportaJá", frauds: 164, value: "R$ 210.120" },
  { merchant: "Foodie App", frauds: 149, value: "R$ 180.020" },
  { merchant: "Style Hub", frauds: 132, value: "R$ 150.900" },
];

const sampleTransactions = Array.from({ length: 24 }).map((_, i) => {
  const statuses = ["Fraude", "Aprovada"];
  const cats = ["Shopping Online", "Varejo POS", "Transporte", "Alimentação", "Serviços"];
  const merchants = ["Mercado Alpha", "Net Store", "TransportaJá", "Foodie App", "Style Hub", "PowerPay", "QuickBuy"];
  const states = ["SP", "RJ", "MG", "BA", "RS", "PR", "SC", "PE", "CE", "DF"];
  const genders = ["Masculino", "Feminino"];
  const amount = (Math.random() * 12000 + 50).toFixed(0);
  return {
    id: `TX-${1000 + i}`,
    date: new Date(Date.now() - i * 3600 * 24 * 1000).toLocaleDateString("pt-BR"),
    merchant: merchants[i % merchants.length],
    category: cats[i % cats.length],
    amount: `R$ ${amount}`,
    amountValue: Number(amount),
    state: states[i % states.length],
    gender: genders[i % genders.length],
    status: statuses[i % statuses.length],
  };
});

const fraudTransactions = sampleTransactions
  .filter((transaction) => transaction.status === "Fraude")
  .sort((a, b) => b.amountValue - a.amountValue)
  .slice(0, 10);

const genderDistribution = Object.entries(
  sampleTransactions.reduce((acc, transaction) => {
    if (transaction.status !== "Fraude") return acc;
    acc[transaction.gender] = (acc[transaction.gender] || 0) + 1;
    return acc;
  }, {})
).map(([name, value]) => ({ name, value }));

const topStateFrauds = Object.entries(
  sampleTransactions.reduce((acc, transaction) => {
    if (transaction.status !== "Fraude") return acc;
    acc[transaction.state] = (acc[transaction.state] || 0) + 1;
    return acc;
  }, {})
)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 5)
  .map(([state, value]) => ({ state, value }));

const totalTransacted = sampleTransactions.reduce((sum, transaction) => sum + transaction.amountValue, 0);
const formatMillionBRL = (value) => {
  const millions = value / 1000000;
  return `R$ ${millions.toFixed(2).replace(".", ",")} M`;
};

const menuItems = [
  { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { key: "fraudes", label: "Fraudes", icon: <ShieldAlert size={18} /> },
  { key: "transacoes", label: "Transações", icon: <CreditCard size={18} /> },
  { key: "ml", label: "Machine Learning", icon: <BrainCircuit size={18} /> },
  { key: "alertas", label: "Alertas", icon: <Bell size={18} /> },
];

const stats = [
  { title: "Valor Total Transacionado", value: formatMillionBRL(totalTransacted), subtitle: "Volume financeiro total processado" },
  { title: "Total Transações", value: "1.296.675", subtitle: "Volume processado" },
  { title: "Total Fraudes", value: "7.506", subtitle: "Casos detectados" },
  { title: "Taxa de Fraude", value: "0,58%", subtitle: "Proporção global" },
  { title: "Valor Fraudado", value: "R$ 3,99M", subtitle: "Perdas estimadas" },
];

function statusBadge(status) {
  if (status === "Fraude") {
    return "status-badge status-fraud";
  }
  return "status-badge status-approved";
}

function App() {
  const [active, setActive] = useState("dashboard");
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [items, setItems] = useState(sampleTransactions);

  useEffect(() => {
    setItems(sampleTransactions);
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    return items.filter(
      (t) =>
        t.id.toLowerCase().includes(query.toLowerCase()) ||
        t.merchant.toLowerCase().includes(query.toLowerCase()) ||
        t.category.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, items]);

  return (
    <div className={`app-shell ${sidebarOpen ? "sidebar-open" : ""}`}>
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-top">
          <div className="brand-block">
            <div className="brand-title">FRAUD</div>
            <div className="brand-subtitle">Analytics</div>
          </div>

          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`sidebar-item ${item.key === active ? "active" : ""}`}
                onClick={() => {
                  setActive(item.key);
                  setSidebarOpen(false);
                }}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">v1.0</div>
      </aside>

      <main className="main-content" onClick={() => sidebarOpen && setSidebarOpen(false)}>
        <div className="topbar executive-header">
          <div className="topbar-head">
            <div className="topbar-title-row">
              <button type="button" className="menu-toggle" onClick={() => setSidebarOpen((prev) => !prev)} aria-label="Abrir menu">
                <span />
                <span />
                <span />
              </button>
              <div className="header-title-block">
                <h1>Fraud Analytics Dashboard</h1>
                <p className="topbar-subtitle">Monitoramento em tempo real de transações, fraudes, alertas e Machine Learning</p>
              </div>
            </div>

            <div className="topbar-status-block">
              <div className="executive-chip">
                <span>Status do Sistema</span>
                <strong>Online</strong>
              </div>
              <div className="executive-chip">
                <span>Modelo ML</span>
                <strong>Ativo</strong>
              </div>
              <div className="executive-chip">
                <span>Última atualização</span>
                <strong>há 2 min</strong>
              </div>
              <div className="executive-chip critical">
                <span>Alertas críticos</span>
                <strong>3</strong>
              </div>
            </div>
          </div>

          <div className="topbar-actions">
            <div className="search-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="search"
                placeholder="Buscar transações"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <button type="button" className="icon-button" aria-label="Notificações">
              <Bell size={18} />
            </button>
            <div className="avatar">BR</div>
          </div>
        </div>

        {active === "dashboard" && <DashboardView filtered={filtered} query={query} />}
        {active === "fraudes" && <FraudesView />}
        {active === "transacoes" && <TransactionsView items={filtered} />}
        {active === "ml" && <MLView />}
        {active === "alertas" && <AlertsView />}
      </main>
    </div>
  );
}

function DashboardView({ filtered }) {
  return (
    <div className="dashboard-view">
      <div className="kpi-grid">
        {stats.map((item) => (
          <motion.div key={item.title} className="kpi-card" whileHover={{ y: -4 }}>
            <div className="label">{item.title}</div>
            <div className="value">{item.value}</div>
            <div className="subtitle">{item.subtitle}</div>
          </motion.div>
        ))}
      </div>

      <div className="dashboard-grid">
        <section className="large-panel">
          <div className="panel-header">
            <div>
              <p className="panel-label">Evolução</p>
              <h2>Fraudes por mês</h2>
            </div>
            <span className="panel-badge">+14% ano a ano</span>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fraudTrend} margin={{ top: 12, right: 12, left: -16, bottom: 4 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="#94A3B8" />
                <YAxis tickLine={false} axisLine={false} stroke="#94A3B8" />
                <Tooltip />
                <Line type="monotone" dataKey="frauds" stroke="#4F46E5" strokeWidth={4} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="small-panel">
          <div className="panel-header">
            <div>
              <p className="panel-label">Categorias</p>
              <h2>Top categorias fraudadas</h2>
            </div>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 12, right: 12, left: -16, bottom: 64 }} barSize={28}>
                <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="#94A3B8" angle={-45} textAnchor="end" />
                <YAxis tickLine={false} axisLine={false} stroke="#94A3B8" />
                <Tooltip />
                <Bar dataKey="value" fill="#6366F1" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="table-grid">
        <section className="table-panel">
          <div className="panel-header">
            <div>
              <p className="panel-label">Tabela</p>
              <h2>Transações recentes</h2>
            </div>
          </div>
          <div className="transactions-panel">
            <div className="table-controls">
              <p className="subtitle">Últimas 10 transações recentes. Use a busca no topo para filtrar.</p>
              <button type="button" className="see-all">Ver tudo</button>
            </div>
            <div className="table-scroll">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th className="col-id">ID</th>
                    <th className="col-date">Data</th>
                    <th className="col-merchant">Merchant</th>
                    <th className="col-category">Categoria</th>
                    <th className="col-amount">Valor</th>
                    <th className="col-status">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, 10).map((item) => (
                    <tr key={item.id}>
                      <td className="col-id">{item.id}</td>
                      <td className="col-date">{item.date}</td>
                      <td className="col-merchant">{item.merchant}</td>
                      <td className="col-category">{item.category}</td>
                      <td className="col-amount">{item.amount}</td>
                      <td className="col-status status-cell">
                        <span className={statusBadge(item.status)}>{item.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="leaderboard-panel">
          <div className="panel-header">
            <div>
              <p className="panel-label">Ranking</p>
              <h2>Top Merchants</h2>
            </div>
          </div>
          <div className="leaderboard-list">
            {topMerchants.map((merchant, index) => (
              <div className="leaderboard-item" key={merchant.merchant}>
                <div className="leaderboard-details">
                  <div className="rank">{index + 1}</div>
                  <div className="details">
                    <div className="merchant">{merchant.merchant}</div>
                    <div className="meta">{merchant.frauds} fraudes</div>
                  </div>
                </div>
                <div className="amount">{merchant.value}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function FraudesView() {
  return (
    <div className="dashboard-view fraud-view">
      <div className="kpi-grid">
        {stats.slice(0, 4).map((item) => (
          <div key={item.title} className="kpi-card">
            <div className="label">{item.title}</div>
            <div className="value">{item.value}</div>
            <div className="subtitle">{item.subtitle}</div>
          </div>
        ))}
      </div>

      <div className="fraud-grid">
        <section className="large-panel">
          <div className="panel-header">
            <div>
              <p className="panel-label">Categorias</p>
              <h2>Top categorias fraudadas</h2>
            </div>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData.slice(0, 5)} margin={{ top: 12, right: 12, left: -18, bottom: 56 }} barSize={28}>
                <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="#94A3B8" tick={{ fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} stroke="#94A3B8" />
                <Tooltip formatter={(value) => value} />
                <Bar dataKey="value" fill="#ef4444" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="small-panel">
          <div className="panel-header">
            <div>
              <p className="panel-label">Evolução</p>
              <h2>Evolução mensal das fraudes</h2>
            </div>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fraudTrend} margin={{ top: 12, right: 12, left: -12, bottom: 12 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="#94A3B8" />
                <YAxis tickLine={false} axisLine={false} stroke="#94A3B8" />
                <Tooltip formatter={(value) => value} />
                <Line type="monotone" dataKey="frauds" stroke="#e11d48" strokeWidth={4} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="fraud-grid">
        <section className="small-panel">
          <div className="panel-header">
            <div>
              <p className="panel-label">Local</p>
              <h2>Top estados com fraude</h2>
            </div>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={topStateFrauds} margin={{ top: 12, right: 12, left: 16, bottom: 12 }} barSize={18}>
                <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} stroke="#94A3B8" />
                <YAxis type="category" dataKey="state" width={90} tickLine={false} axisLine={false} stroke="#94A3B8" />
                <Tooltip formatter={(value) => value} />
                <Bar dataKey="value" fill="#6366F1" radius={[12, 0, 0, 12]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="small-panel">
          <div className="panel-header">
            <div>
              <p className="panel-label">Distribuição</p>
              <h2>Distribuição por gênero</h2>
            </div>
          </div>
          <div className="chart-wrapper pie-chart">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={genderDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={56}
                  outerRadius={96}
                  paddingAngle={8}
                  label={({ name, percent }) => `${name}: ${Math.round(percent * 100)}%`}
                >
                  {genderDistribution.map((entry, index) => (
                    <Cell key={`gender-${index}`} fill={index === 0 ? "#10b981" : "#ef4444"} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="table-panel" style={{ marginTop: 12 }}>
        <div className="panel-header">
          <div>
            <p className="panel-label">Fraudes</p>
            <h2>Top transações fraudulentas</h2>
          </div>
          <span className="panel-badge">Baseadas nos dados de análise</span>
        </div>
        <div className="table-controls" style={{ marginBottom: 12, flexWrap: "wrap", gap: "12px" }}>
          <p className="subtitle">IDs mais relevantes para investigação, ordenados pelo valor.</p>
        </div>
        <div className="table-scroll">
          <table className="transactions-table">
            <thead>
              <tr>
                <th className="col-id">ID</th>
                <th className="col-merchant">Merchant</th>
                <th className="col-category">Categoria</th>
                <th className="col-amount">Valor</th>
                <th className="col-state">Estado</th>
                <th className="col-date">Data</th>
              </tr>
            </thead>
            <tbody>
              {fraudTransactions.map((item) => (
                <tr key={item.id}>
                  <td className="col-id">{item.id}</td>
                  <td className="col-merchant">{item.merchant}</td>
                  <td className="col-category">{item.category}</td>
                  <td className="col-amount">{item.amount}</td>
                  <td className="col-state">{item.state}</td>
                  <td className="col-date">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function TransactionsView({ items }) {
  return (
    <div className="dashboard-view">
      <section className="table-panel full-width">
        <div className="panel-header">
          <div>
            <p className="panel-label">Transações</p>
            <h2>Movimentação recente</h2>
          </div>
        </div>
        <div className="table-scroll">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Data</th>
                <th>Merchant</th>
                <th>Categoria</th>
                <th>Valor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.date}</td>
                  <td>{item.merchant}</td>
                  <td>{item.category}</td>
                  <td>{item.amount}</td>
                  <td>
                    <span className={statusBadge(item.status)}>{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function MLView() {
  // dados mock para os novos gráficos
  const kpis = [
    { title: "Precision", value: "92,3%", subtitle: "Acurácia do modelo" },
    { title: "Recall", value: "89,7%", subtitle: "Sensibilidade" },
    { title: "Accuracy", value: "94,1%", subtitle: "Classificação geral" },
    { title: "F1 Score", value: "90,9%", subtitle: "Equilíbrio" },
  ];

  const confusionData = [
    // x = predicted (0 negative,1 positive), y = actual (0 negative,1 positive), value = count
    { x: 0, y: 0, value: 1200 },
    { x: 1, y: 0, value: 16 },
    { x: 0, y: 1, value: 80 },
    { x: 1, y: 1, value: 200 },
  ];

  const accuracyTrend = [
    { month: "Jan", acc: 0.90 },
    { month: "Fev", acc: 0.91 },
    { month: "Mar", acc: 0.915 },
    { month: "Abr", acc: 0.913 },
    { month: "Mai", acc: 0.92 },
    { month: "Jun", acc: 0.941 },
  ];

  const featureImportance = [
    { name: "amount", value: 0.32 },
    { name: "device_score", value: 0.22 },
    { name: "merchant_risk", value: 0.15 },
    { name: "time_of_day", value: 0.11 },
    { name: "country", value: 0.08 },
    { name: "user_history", value: 0.06 },
  ];

  const predictionDist = [
    { name: "Aprovada", value: 8600 },
    { name: "Fraude", value: 400 },
  ];

  const modelInfo = {
    name: "XGBoost FraudDetector",
    version: "v2.4.1",
    status: "Em produção",
    last_trained: "2026-05-28",
  };

  // Helpers para color map
  const heatColor = (v, max) => {
    const ratio = v / max;
    const r = Math.round(255 * (1 - ratio) + 99 * ratio);
    const g = Math.round(245 * (1 - ratio) + 66 * ratio);
    const b = Math.round(245 * (1 - ratio) + 255 * ratio);
    return `rgb(${r},${g},${b})`;
  };

  const heatTextColor = (v, max) => {
    const ratio = v / max;
    return ratio > 0.5 ? "#ffffff" : "#0f172a";
  };

  const renderPredictionLabel = ({ cx, cy, midAngle, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 18;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const textAnchor = x > cx ? "start" : "end";

    return (
      <text
        x={x}
        y={y}
        fill="#0f172a"
        textAnchor={textAnchor}
        dominantBaseline="central"
        fontSize={13}
        fontWeight={700}
      >
        {`${name}: ${Math.round(percent * 100)}%`}
      </text>
    );
  };

  const maxConf = Math.max(...confusionData.map((d) => d.value));

  return (
    <div className="dashboard-view ml-view">
      <div className="kpi-grid">
        {kpis.map((item) => (
          <div key={item.title} className="kpi-card">
            <div className="label">{item.title}</div>
            <div className="value">{item.value}</div>
            <div className="subtitle">{item.subtitle}</div>
          </div>
        ))}
      </div>

      <div className="ml-grid">
        <div className="ml-left">
          <section className="large-panel">
            <div className="panel-header">
              <div>
                <p className="panel-label">Métricas</p>
                <h2>Matriz de Confusão</h2>
              </div>
            </div>
            <div className="chart-wrapper heatmap-wrap">
              <div className="confusion-card">
                <div className="confusion-heading">Previsto</div>
                <div className="confusion-grid">
                  <div className="confusion-empty" />
                  <div className="confusion-axis-label">Normal</div>
                  <div className="confusion-axis-label">Fraude</div>

                  <div className="confusion-axis-label side-label">Real Normal</div>
                  <div className="confusion-cell" style={{ background: heatColor(1200, maxConf), color: heatTextColor(1200, maxConf) }}>
                    <div className="cell-label">Verdadeiro Negativo</div>
                    <div className="cell-value">1200</div>
                  </div>
                  <div className="confusion-cell" style={{ background: heatColor(16, maxConf), color: heatTextColor(16, maxConf) }}>
                    <div className="cell-label">Falso Positivo</div>
                    <div className="cell-value">16</div>
                  </div>

                  <div className="confusion-axis-label side-label">Real Fraude</div>
                  <div className="confusion-cell" style={{ background: heatColor(80, maxConf), color: heatTextColor(80, maxConf) }}>
                    <div className="cell-label">Falso Negativo</div>
                    <div className="cell-value">80</div>
                  </div>
                  <div className="confusion-cell" style={{ background: heatColor(200, maxConf), color: heatTextColor(200, maxConf) }}>
                    <div className="cell-label">Verdadeiro Positivo</div>
                    <div className="cell-value">200</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="large-panel" style={{ marginTop: 12 }}>
            <div className="panel-header">
              <div>
                <p className="panel-label">Desempenho</p>
                <h2>Evolução do Accuracy</h2>
              </div>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={accuracyTrend} margin={{ top: 12, right: 12, left: -16, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} domain={[0.88, 1]} tickFormatter={(v) => `${Math.round(v*100)}%`} />
                  <Tooltip formatter={(v) => `${Math.round(v*100)}%`} />
                  <Line type="monotone" dataKey="acc" stroke="#06b6d4" strokeWidth={3} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        <div className="ml-right">
          <section className="small-panel">
            <div className="panel-header">
              <div>
                <p className="panel-label">Importância</p>
                <h2>Feature Importance</h2>
              </div>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart layout="vertical" data={featureImportance} margin={{ left: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={120} />
                  <Tooltip formatter={(v) => `${Math.round(v*100)}%`} />
                  <Bar dataKey="value" fill="#6366F1" radius={[6,6,6,6]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="small-panel" style={{ marginTop: 12 }}>
            <div className="panel-header">
              <div>
                <p className="panel-label">Distribuição</p>
                <h2>Distribuição das previsões</h2>
              </div>
            </div>
            <div className="chart-wrapper pie-chart">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart margin={{ left: 32, right: 32, top: 20, bottom: 20 }}>
                  <Pie
                    data={predictionDist}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={66}
                    outerRadius={120}
                    paddingAngle={6}
                    labelLine={false}
                    label={renderPredictionLabel}
                  >
                    {predictionDist.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={i === 0 ? "#10b981" : "#ef4444"} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="pie-legend">
                <div className="pie-legend-item">
                  <span className="pie-legend-dot approved" />
                  Aprovada
                </div>
                <div className="pie-legend-item">
                  <span className="pie-legend-dot fraud" />
                  Fraude
                </div>
              </div>
            </div>
          </section>

          <section className="small-panel model-card" style={{ marginTop: 12 }}>
            <div className="panel-header">
              <div>
                <p className="panel-label">Operacional</p>
                <h2>Card do Modelo</h2>
              </div>
            </div>
            <div className="model-body">
              <div className="model-row"><strong>Modelo:</strong> <span>{modelInfo.name}</span></div>
              <div className="model-row"><strong>Versão:</strong> <span>{modelInfo.version}</span></div>
              <div className="model-row"><strong>Status:</strong> <span>{modelInfo.status}</span></div>
              <div className="model-row"><strong>Último treinamento:</strong> <span>{modelInfo.last_trained}</span></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function AlertsView() {
  const [selectedSeverity, setSelectedSeverity] = useState("Todas");
  const [selectedStatus, setSelectedStatus] = useState("Todos");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  const alertEvents = useMemo(() => {
    const now = Date.now();
    const template = [
      { type: "Tentativa repetida", severity: "Alta", merchant: "Mercado Alpha", status: "Aberto", owner: "Aline" , hoursAgo: 1.2},
      { type: "Score alto detectado", severity: "Alta", merchant: "Net Store", status: "Em progresso", owner: "Bruno", hoursAgo: 2.5 },
      { type: "Cartão em blacklist", severity: "Alta", merchant: "QuickBuy", status: "Aberto", owner: "Camila", hoursAgo: 3.1 },
      { type: "IP desconhecido", severity: "Média", merchant: "TransportaJá", status: "Em progresso", owner: "Davi", hoursAgo: 4.3 },
      { type: "Valor atípico", severity: "Média", merchant: "Foodie App", status: "Resolvido", owner: "Eduarda", hoursAgo: 5.7 },
      { type: "Cartão virtual usado", severity: "Média", merchant: "Style Hub", status: "Aberto", owner: "Felipe", hoursAgo: 7.4 },
      { type: "Regra de score disparada", severity: "Alta", merchant: "PowerPay", status: "Em progresso", owner: "Gabriela", hoursAgo: 8.6 },
      { type: "Gateway suspeito", severity: "Baixa", merchant: "Net Store", status: "Resolvido", owner: "Hugo", hoursAgo: 9.9 },
      { type: "Transação em horário atípico", severity: "Baixa", merchant: "Mercado Alpha", status: "Em progresso", owner: "Isabela", hoursAgo: 11.1 },
      { type: "Tentativa de fraude bloqueada", severity: "Alta", merchant: "Foodie App", status: "Resolvido", owner: "João", hoursAgo: 13.2 },
      { type: "Mudança de dispositivo", severity: "Média", merchant: "QuickBuy", status: "Aberto", owner: "Karina", hoursAgo: 17.8 },
      { type: "Geo discrepante", severity: "Baixa", merchant: "TransportaJá", status: "Aberto", owner: "Lucas", hoursAgo: 21.3 },
    ];

    return template.map((item, index) => {
      const timestamp = now - item.hoursAgo * 3600 * 1000;
      return {
        id: `AL-${1000 + index}`,
        dateTime: new Date(timestamp).toLocaleString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: new Date(timestamp).toISOString().slice(0, 10),
        ...item,
      };
    });
  }, []);

  const severityData = useMemo(() => {
    const counts = alertEvents.reduce(
      (acc, alert) => {
        acc[alert.severity] = (acc[alert.severity] || 0) + 1;
        return acc;
      },
      { Alta: 0, Média: 0, Baixa: 0 }
    );

    return [
      { name: "Alta", value: counts.Alta },
      { name: "Média", value: counts.Média },
      { name: "Baixa", value: counts.Baixa },
    ];
  }, [alertEvents]);

  const alertTrend = useMemo(() => {
    const points = Array.from({ length: 24 }).map((_, index) => ({
      hour: `${String((new Date().getHours() + index + 1) % 24).padStart(2, "0")}h`,
      alerts: 2 + Math.floor(Math.sin(index / 3) * 3 + 4),
    }));
    return points;
  }, []);

  const ruleHits = [
    { rule: "Regra de score alto", hits: 52 },
    { rule: "Tentativas pelo mesmo IP", hits: 38 },
    { rule: "Cartão em blacklist", hits: 26 },
    { rule: "Transações estrangeiras", hits: 18 },
    { rule: "Mudança de dispositivo", hits: 14 },
  ];

  const filteredAlerts = useMemo(() => {
    return alertEvents.filter((alert) => {
      const matchSeverity = selectedSeverity === "Todas" || alert.severity === selectedSeverity;
      const matchStatus = selectedStatus === "Todos" || alert.status === selectedStatus;
      const matchDate = !selectedDate || alert.date === selectedDate;
      return matchSeverity && matchStatus && matchDate;
    });
  }, [alertEvents, selectedSeverity, selectedStatus, selectedDate]);

  const totalAlerts = alertEvents.length;
  const highAlerts = severityData.find((item) => item.name === "Alta")?.value || 0;
  const mediumAlerts = severityData.find((item) => item.name === "Média")?.value || 0;
  const lowAlerts = severityData.find((item) => item.name === "Baixa")?.value || 0;

  return (
    <div className="dashboard-view fraud-view">
      <div className="kpi-grid">
        {[
          { title: "Total de alertas", value: String(totalAlerts), subtitle: "Últimas 24 horas" },
          { title: "Alta prioridade", value: String(highAlerts), subtitle: "Impacto imediato" },
          { title: "Média prioridade", value: String(mediumAlerts), subtitle: "Monitoramento" },
          { title: "Baixa prioridade", value: String(lowAlerts), subtitle: "Acompanhamento" },
        ].map((item) => (
          <div key={item.title} className="kpi-card">
            <div className="label">{item.title}</div>
            <div className="value">{item.value}</div>
            <div className="subtitle">{item.subtitle}</div>
          </div>
        ))}
      </div>

      <section className="table-panel" style={{ marginBottom: 12 }}>
        <div className="panel-header">
          <div>
            <p className="panel-label">Centro de monitoramento</p>
            <h2>Alertas em tempo real</h2>
          </div>
          <span className="panel-badge">Últimas 24 horas</span>
        </div>

        <div className="alert-filters">
          <div className="filter-group">
            <label>Severidade</label>
            <select value={selectedSeverity} onChange={(e) => setSelectedSeverity(e.target.value)}>
              <option value="Todas">Todas</option>
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
              <option value="Baixa">Baixa</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Status</label>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
              <option value="Todos">Todos</option>
              <option value="Aberto">Aberto</option>
              <option value="Em progresso">Em progresso</option>
              <option value="Resolvido">Resolvido</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Data</label>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          </div>
        </div>
      </section>

      <div className="alerts-grid">
        <section className="large-panel">
          <div className="panel-header">
            <div>
              <p className="panel-label">Severidade</p>
              <h2>Alertas por severidade</h2>
            </div>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={severityData} margin={{ top: 12, right: 16, left: -10, bottom: 18 }} barSize={36}>
                <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#94A3B8" />
                <YAxis tickLine={false} axisLine={false} stroke="#94A3B8" />
                <Tooltip formatter={(value) => value} />
                <Bar dataKey="value" fill="#ef4444" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <div className="alerts-side">
          <section className="small-panel compact-panel">
            <div className="panel-header">
              <div>
                <p className="panel-label">Tendência</p>
                <h2>Evolução nas últimas 24h</h2>
              </div>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={alertTrend} margin={{ top: 12, right: 16, left: -10, bottom: 12 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" />
                  <XAxis dataKey="hour" tickLine={false} axisLine={false} stroke="#94A3B8" />
                  <YAxis tickLine={false} axisLine={false} stroke="#94A3B8" />
                  <Tooltip formatter={(value) => `${value} alertas`} />
                  <Line type="monotone" dataKey="alerts" stroke="#4f46e5" strokeWidth={4} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="small-panel compact-panel">
            <div className="panel-header">
              <div>
                <p className="panel-label">Ranking</p>
                <h2>Regras mais acionadas</h2>
              </div>
            </div>
            <div className="rule-list">
              {ruleHits.map((rule) => (
                <div className="rule-item" key={rule.rule}>
                  <div>
                    <div className="rule-name">{rule.rule}</div>
                    <div className="subtitle">Ações recentes</div>
                  </div>
                  <div className="rule-count">{rule.hits}x</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <section className="table-panel" style={{ marginTop: 12 }}>
        <div className="panel-header">
          <div>
            <p className="panel-label">Alertas</p>
            <h2>Tabela de alertas</h2>
          </div>
          <span className="panel-badge">Filtrando registros</span>
        </div>
        <div className="table-controls" style={{ marginBottom: 14, flexWrap: "wrap", gap: "12px" }}>
          <p className="subtitle">Acompanhe os alertas mais críticos com filtros de severidade, status e data.</p>
        </div>
        <div className="table-scroll">
          <table className="transactions-table">
            <thead>
              <tr>
                <th className="col-date">Data/Hora</th>
                <th className="col-type">Tipo</th>
                <th className="col-status">Severidade</th>
                <th className="col-merchant">Merchant</th>
                <th className="col-state">Status</th>
                <th className="col-owner">Responsável</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.map((alert) => (
                <tr key={alert.id}>
                  <td className="col-date">{alert.dateTime}</td>
                  <td className="col-type">{alert.type}</td>
                  <td className="col-status">
                    <span className={`alert-chip ${alert.severity.toLowerCase().replace(/é/g, "e")}`}>{alert.severity}</span>
                  </td>
                  <td className="col-merchant">{alert.merchant}</td>
                  <td className="col-state">
                    <span className={`status-pill ${alert.status.replace(/\s+/g, "-").toLowerCase()}`}>{alert.status}</span>
                  </td>
                  <td className="col-owner">{alert.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default App;
