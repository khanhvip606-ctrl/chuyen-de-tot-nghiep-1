
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity, AlertCircle, ArrowLeft, CheckCircle2, Clock3,
  FilePlus2, LayoutDashboard, LoaderCircle, Menu, MonitorSmartphone,
  Plus, RefreshCw, Search, ShieldCheck, Ticket, Users, Wrench, X
} from "lucide-react";

import { ticketApi } from "./api/tickets.api";
import { customerApi } from "./api/customers.api";
import { deviceApi } from "./api/devices.api";
import "./App.css";

const STATUSES = [
  ["MOI", "Mới tiếp nhận"],
  ["DANG_XU_LY", "Đang xử lý"],
  ["CHO_LINH_KIEN", "Chờ linh kiện"],
  ["DA_HOAN_TAT", "Đã hoàn tất"],
  ["DA_HUY", "Đã hủy"],
];

const PRIORITIES = [
  ["CAO", "Cao"],
  ["TRUNG_BINH", "Trung bình"],
  ["THAP", "Thấp"],
];

const CATEGORIES = [
  ["PHAN_CUNG", "Lỗi phần cứng"],
  ["PHAN_MEM", "Lỗi phần mềm"],
  ["BAO_HANH", "Bảo hành"],
  ["KHAC", "Khác"],
];

function labelOf(items, value) {
  return items.find(([key]) => key === value)?.[1] || value || "—";
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function DataState({ loading, error, empty, onRetry, children }) {
  if (loading) {
    return (
      <div className="state-box">
        <LoaderCircle className="spin" size={28} />
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-box">
        <AlertCircle size={32} />
        <h3>Không thể tải dữ liệu</h3>
        <p>{error}</p>
        <button className="button primary" onClick={onRetry}>
          <RefreshCw size={16} /> Thử lại
        </button>
      </div>
    );
  }

  if (empty) {
    return (
      <div className="state-box">
        <Ticket size={32} />
        <h3>Chưa có dữ liệu</h3>
        <p>Không tìm thấy kết quả phù hợp.</p>
      </div>
    );
  }

  return children;
}

function App() {
  const [page, setPage] = useState("tickets");
  const [tickets, setTickets] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [history, setHistory] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

function parseDateInput(value) {
  const text = value.trim();
  if (!text) return null;

  const match = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) {
    throw new Error("Ngày phải có định dạng dd/MM/yyyy, ví dụ 05/09/2026.");
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error("Ngày không hợp lệ. Vui lòng kiểm tra ngày, tháng, năm.");
  }

  return `${match[3]}-${match[2]}-${match[1]}`;
}
const initialForm = {
  customer_mode: "existing",
  customer_id: "",
  customer_name: "",
  phone: "",
  email: "",
  address: "",

  device_mode: "existing",
  device_id: "",
  device_name: "",
  serial_number: "",
  purchase_date: "",
  warranty_expiry: "",

  issue_category: "PHAN_CUNG",
  issue_description: "",
  priority: "TRUNG_BINH",
};

const [form, setForm] = useState(initialForm);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [ticketData, customerData, deviceData] = await Promise.all([
        ticketApi.getAll(),
        customerApi.getAll(),
        deviceApi.getAll(),
      ]);

      setTickets(Array.isArray(ticketData) ? ticketData : []);
      setCustomers(Array.isArray(customerData) ? customerData : []);
      setDevices(Array.isArray(deviceData) ? deviceData : []);
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  useEffect(() => {
    const handleExpired = () => {
      setNotice("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
    };

    window.addEventListener("auth-expired", handleExpired);
    return () => window.removeEventListener("auth-expired", handleExpired);
  }, []);

  const loadDetail = useCallback(async (id) => {
    setSelectedId(id);
    setPage("detail");
    setDetail(null);
    setHistory([]);
    setDetailError("");
    setDetailLoading(true);

    try {
      const [ticketData, historyData] = await Promise.all([
        ticketApi.getById(id),
        ticketApi.getHistory(id),
      ]);

      setDetail(ticketData);
      setHistory(Array.isArray(historyData) ? historyData : []);
    } catch (err) {
      setDetailError(err.message || "Không tải được chi tiết phiếu.");
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const filteredTickets = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const matchesStatus =
        statusFilter === "ALL" || ticket.status === statusFilter;

      const matchesQuery =
        !keyword ||
        [
          ticket.ticket_code,
          ticket.customer_name,
          ticket.device_name,
          ticket.serial_number,
          ticket.issue_description,
        ].some((value) => String(value || "").toLowerCase().includes(keyword));

      return matchesStatus && matchesQuery;
    });
  }, [tickets, query, statusFilter]);

  const counts = useMemo(() => ({
    total: tickets.length,
    new: tickets.filter((t) => t.status === "MOI").length,
    processing: tickets.filter((t) => t.status === "DANG_XU_LY").length,
    urgent: tickets.filter((t) => t.priority === "CAO").length,
  }), [tickets]);

  const visibleDevices = devices.filter(
    (device) => String(device.customer_id) === String(form.customer_id)
  );

  function navigate(nextPage) {
    setPage(nextPage);
    setMobileMenu(false);
    setNotice("");
  }

  
function updateForm(field, value) {
  setForm((previous) => ({
    ...previous,
    [field]: value,
    ...(field === "customer_id"
      ? { device_id: "" }
      : {}),
  }));
}

async function createTicket(event) {
  event.preventDefault();
  setSaving(true);
  setNotice("");

  try {
    let customerId;
    let deviceId;

    // Bước 1: Lấy khách hàng cũ hoặc tạo khách hàng mới
    if (form.customer_mode === "new") {
      const customer = await customerApi.create({
        customer_name: form.customer_name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        address: form.address.trim() || null,
      });

      customerId = customer.customer_id;
    } else {
      customerId = Number(form.customer_id);
    }

    if (!Number.isInteger(Number(customerId)) || Number(customerId) <= 0) {
      throw new Error("Vui lòng chọn hoặc tạo khách hàng hợp lệ.");
    }

    // Bước 2: Lấy thiết bị cũ hoặc tạo thiết bị mới
    if (form.device_mode === "new") {
      const device = await deviceApi.create({
        customer_id: Number(customerId),
        device_name: form.device_name.trim(),
        serial_number: form.serial_number.trim(),
        purchase_date: parseDateInput(form.purchase_date),
        warranty_expiry: parseDateInput(form.warranty_expiry),
      });

      deviceId = device.device_id;
    } else {
      deviceId = Number(form.device_id);
    }

    if (!Number.isInteger(Number(deviceId)) || Number(deviceId) <= 0) {
      throw new Error("Vui lòng chọn hoặc tạo thiết bị hợp lệ.");
    }

    // Bước 3: Chỉ tạo phiếu sau khi đã có khách hàng và thiết bị
    const created = await ticketApi.create({
      customer_id: Number(customerId),
      device_id: Number(deviceId),
      issue_category: form.issue_category,
      issue_description: form.issue_description.trim(),
      priority: form.priority,
    });

    // Tải lại danh sách dữ liệu mới nhất
    await loadData();

    setForm({ ...initialForm });
    setNotice("Tiếp nhận phiếu bảo hành thành công.");

    if (created?.ticket_id) {
      await loadDetail(created.ticket_id);
    } else {
      setPage("tickets");
    }
  } catch (err) {
    setNotice(
      err.message || "Không thể tạo phiếu bảo hành."
    );
  } finally {
    setSaving(false);
  }
}


 

  async function updateTicketStatus(event) {
    event.preventDefault();
    if (!detail) return;

    const data = new FormData(event.currentTarget);
    const status = data.get("status");
    const note = String(data.get("note") || "").trim();

    setSaving(true);
    setNotice("");

    try {
      await ticketApi.updateStatus(detail.ticket_id, status, note);
      await loadDetail(detail.ticket_id);
      await loadData();
      setNotice("Đã cập nhật trạng thái phiếu.");
    } catch (err) {
      setNotice(err.message || "Không thể cập nhật trạng thái.");
    } finally {
      setSaving(false);
    }
  }

  const currentCustomer = customers.find(
    (customer) => String(customer.customer_id) === String(form.customer_id)
  );

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon"><ShieldCheck size={25} /></div>
          <div>
            <strong>MEKONG MOBILE</strong>
            <span>SMART CRM</span>
          </div>
          <button className="icon-button mobile-close" onClick={() => setMobileMenu(false)}>
            <X size={19} />
          </button>
        </div>

        <div className="workspace-label">KHÔNG GIAN LÀM VIỆC</div>
        <nav className="side-nav">
          <button
            className={page === "overview" ? "nav-item active" : "nav-item"}
            onClick={() => navigate("overview")}
          >
            <LayoutDashboard size={18} /> Tổng quan
          </button>
          <button
            className={page === "tickets" || page === "detail" ? "nav-item active" : "nav-item"}
            onClick={() => navigate("tickets")}
          >
            <Ticket size={18} /> Phiếu bảo hành
            <span className="nav-count">{tickets.length}</span>
          </button>
          <button
            className={page === "create" ? "nav-item active" : "nav-item"}
            onClick={() => navigate("create")}
          >
            <FilePlus2 size={18} /> Tiếp nhận yêu cầu
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="system-card">
            <div className="system-icon"><Activity size={18} /></div>
            <div>
              <strong>Trạng thái hệ thống</strong>
              <span><i className="online-dot" /> Đang kết nối API</span>
            </div>
          </div>
          <div className="profile">
            <div className="avatar">NV</div>
            <div className="profile-info">
              <strong>Nhân viên tiếp nhận</strong>
              <span>Smart CRM Mekong</span>
            </div>
          </div>
        </div>
      </aside>

      {mobileMenu && (
        <button
          className="sidebar-overlay"
          aria-label="Đóng menu"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button menu-button" onClick={() => setMobileMenu(true)}>
              <Menu size={21} />
            </button>
            <div className="breadcrumb">Smart CRM <span>/</span> Mekong Mobile</div>
          </div>
          <div className="topbar-right">
            <span className="api-indicator"><i className="online-dot" /> API trực tuyến</span>
            <button className="icon-button" title="Làm mới dữ liệu" onClick={loadData}>
              <RefreshCw size={18} />
            </button>
            <div className="top-avatar"><Users size={18} /></div>
          </div>
        </header>

        <div className="page-content">
          {notice && (
            <div className="notice">
              <span>{notice}</span>
              <button className="icon-button" onClick={() => setNotice("")}><X size={16} /></button>
            </div>
          )}

          {page === "overview" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">TRUNG TÂM ĐIỀU HÀNH</div>
                  <h1>Tổng quan</h1>
                  <p>Theo dõi tình hình tiếp nhận và xử lý bảo hành.</p>
                </div>
                <button className="button primary" onClick={() => navigate("create")}>
                  <Plus size={17} /> Tạo phiếu mới
                </button>
              </div>
              <DataState loading={loading} error={error} empty={false} onRetry={loadData}>
                <div className="stats-grid">
                  <StatCard icon={<Ticket />} label="Tổng phiếu" value={counts.total} detail="Tất cả phiếu bảo hành" />
                  <StatCard icon={<Clock3 />} label="Mới tiếp nhận" value={counts.new} detail="Chờ xử lý" />
                  <StatCard icon={<Wrench />} label="Đang xử lý" value={counts.processing} detail="Đang thực hiện" />
                  <StatCard icon={<AlertCircle />} label="Ưu tiên cao" value={counts.urgent} detail="Cần chú ý" />
                </div>
                <section className="panel">
                  <PanelTitle title="Phiếu cập nhật gần đây" subtitle="Dữ liệu mới nhất từ hệ thống" />
                  <TicketTable tickets={tickets.slice(0, 5)} onSelect={loadDetail} />
                </section>
              </DataState>
            </>
          )}

          {page === "tickets" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">QUẢN LÝ BẢO HÀNH</div>
                  <h1>Phiếu bảo hành</h1>
                  <p>Quản lý yêu cầu và theo dõi tiến độ xử lý của khách hàng.</p>
                </div>
                <button className="button primary" onClick={() => navigate("create")}>
                  <Plus size={17} /> Tiếp nhận phiếu
                </button>
              </div>

              <DataState loading={loading} error={error} empty={false} onRetry={loadData}>
                <div className="stats-grid compact-stats">
                  <StatCard icon={<Ticket />} label="Tổng phiếu" value={counts.total} detail="Trong hệ thống" />
                  <StatCard icon={<Clock3 />} label="Mới tiếp nhận" value={counts.new} detail="Chờ phân công" />
                  <StatCard icon={<Wrench />} label="Đang xử lý" value={counts.processing} detail="Đang thực hiện" />
                  <StatCard icon={<AlertCircle />} label="Ưu tiên cao" value={counts.urgent} detail="Ưu tiên xử lý" />
                </div>

                <section className="panel">
                  <PanelTitle title="Danh sách yêu cầu" subtitle={`${filteredTickets.length} phiếu được tìm thấy`} />
                  <div className="toolbar">
                    <div className="search-box">
                      <Search size={17} />
                      <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Tìm mã phiếu, khách hàng, thiết bị..."
                      />
                      {query && <button className="clear-search" onClick={() => setQuery("")}><X size={15} /></button>}
                    </div>
                    <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                      <option value="ALL">Tất cả trạng thái</option>
                      {STATUSES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </div>
                  <DataState
                    loading={false}
                    error=""
                    empty={filteredTickets.length === 0}
                    onRetry={loadData}
                  >
                    <TicketTable tickets={filteredTickets} onSelect={loadDetail} />
                  </DataState>
                </section>
              </DataState>
            </>
          )}

          {page === "create" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">QUY TRÌNH TIẾP NHẬN</div>
                  <h1>Tiếp nhận yêu cầu</h1>
                  <p>Nhập thông tin khách hàng, thiết bị và phân loại sự cố.</p>
                </div>
                <button className="button secondary" onClick={() => navigate("tickets")}>
                  <ArrowLeft size={17} /> Quay lại danh sách
                </button>
              </div>

              <DataState loading={loading} error={error} empty={false} onRetry={loadData}>
                <form className="form-layout" onSubmit={createTicket}>
<section className="panel form-panel">
  <PanelTitle
    title="Thông tin khách hàng"
    subtitle="Chọn khách hàng có sẵn hoặc đăng ký khách hàng mới"
  />
  <div className="form-grid">
    <label className="field full-width">
      <span>Loại khách hàng <b>*</b></span>
      <select
        value={form.customer_mode}
        onChange={(event) => {
          const mode = event.target.value;
          setForm((previous) => ({
            ...previous,
            customer_mode: mode,
            customer_id: "",
            device_id: "",
            device_mode: mode === "new" ? "new" : previous.device_mode,
          }));
        }}
      >
        <option value="existing">Khách hàng đã có</option>
        <option value="new">Khách hàng mới</option>
      </select>
    </label>

    {form.customer_mode === "existing" ? (
      <>
        <label className="field full-width">
          <span>Khách hàng <b>*</b></span>
          <select
            required
            value={form.customer_id}
            onChange={(event) => {
              updateForm("customer_id", event.target.value);
              updateForm("device_id", "");
            }}
          >
            <option value="">Chọn khách hàng</option>
            {customers.map((customer) => (
              <option key={customer.customer_id} value={customer.customer_id}>
                {customer.customer_name} — {customer.phone}
              </option>
            ))}
          </select>
        </label>

        {currentCustomer && (
          <div className="customer-preview full-width">
            <div className="customer-preview-avatar"><Users size={20} /></div>
            <div>
              <strong>{currentCustomer.customer_name}</strong>
              <span>{currentCustomer.phone}</span>
              <span>{currentCustomer.email || "Chưa có email"}</span>
              <span>{currentCustomer.address || "Chưa có địa chỉ"}</span>
            </div>
          </div>
        )}
      </>
    ) : (
      <>
        <label className="field">
          <span>Họ tên khách hàng <b>*</b></span>
          <input
            required
            value={form.customer_name}
            onChange={(event) => updateForm("customer_name", event.target.value)}
            placeholder="Nhập họ tên"
          />
        </label>
        <label className="field">
          <span>Số điện thoại <b>*</b></span>
          <input
            required
            type="tel"
            pattern="0[0-9]{9}"
            title="Nhập 10 chữ số, bắt đầu bằng số 0"
            value={form.phone}
            onChange={(event) => updateForm("phone", event.target.value)}
            placeholder="0901234567"
          />
        </label>
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => updateForm("email", event.target.value)}
            placeholder="email@example.com"
          />
        </label>
        <label className="field">
          <span>Địa chỉ</span>
          <input
            value={form.address}
            onChange={(event) => updateForm("address", event.target.value)}
            placeholder="Nhập địa chỉ"
          />
        </label>
      </>
    )}
  </div>
</section>

<section className="panel form-panel">
  <PanelTitle
    title="Thông tin thiết bị"
    subtitle="Chọn thiết bị đã đăng ký hoặc thêm thiết bị mới"
  />
  <div className="form-grid">
    <label className="field full-width">
      <span>Loại thiết bị <b>*</b></span>
      <select
        value={form.device_mode}
        disabled={form.customer_mode === "new"}
        onChange={(event) => {
          setForm((previous) => ({
            ...previous,
            device_mode: event.target.value,
            device_id: "",
          }));
        }}
      >
        <option value="existing">Thiết bị đã có</option>
        <option value="new">Thiết bị mới</option>
      </select>
    </label>

    {form.device_mode === "existing" && form.customer_mode === "existing" ? (
      <>
        <label className="field full-width">
          <span>Thiết bị <b>*</b></span>
          <select
            required
            value={form.device_id}
            onChange={(event) => updateForm("device_id", event.target.value)}
            disabled={!form.customer_id}
          >
            <option value="">Chọn thiết bị</option>
            {visibleDevices.map((device) => (
              <option key={device.device_id} value={device.device_id}>
                {device.device_name} — {device.serial_number}
              </option>
            ))}
          </select>
          {form.customer_id && visibleDevices.length === 0 && (
            <small>Khách hàng này chưa có thiết bị trong hệ thống.</small>
          )}
        </label>

        {form.device_id && (
          <div className="device-preview full-width">
            <MonitorSmartphone size={22} />
            <div>
              <strong>
                {devices.find((item) => String(item.device_id) === String(form.device_id))?.device_name}
              </strong>
              <span>
                Mã serial: {devices.find((item) => String(item.device_id) === String(form.device_id))?.serial_number}
              </span>
              <span>
                Hạn bảo hành: {devices.find((item) => String(item.device_id) === String(form.device_id))?.warranty_expiry || "Chưa xác định"}
              </span>
            </div>
          </div>
        )}
      </>
    ) : (
      <>
        <label className="field">
          <span>Tên thiết bị <b>*</b></span>
          <input
            required
            value={form.device_name}
            onChange={(event) => updateForm("device_name", event.target.value)}
            placeholder="Ví dụ: Mekong Mobile X3"
          />
        </label>
        <label className="field">
          <span>Mã serial <b>*</b></span>
          <input
            required
            value={form.serial_number}
            onChange={(event) => updateForm("serial_number", event.target.value)}
            placeholder="Nhập mã serial"
          />
        </label>
       <label className="field">
  <span>Ngày mua</span>
  <input
    className="date-input"
    type="text"
    inputMode="numeric"
    value={form.purchase_date}
    onChange={(event) => updateForm("purchase_date", event.target.value)}
    placeholder="dd/MM/yyyy"
    maxLength={10}
  />
  <small>Ví dụ: 05/09/2026</small>
</label>

<label className="field">
  <span>Ngày hết hạn bảo hành</span>
  <input
    className="date-input"
    type="text"
    inputMode="numeric"
    value={form.warranty_expiry}
    onChange={(event) => updateForm("warranty_expiry", event.target.value)}
    placeholder="dd/MM/yyyy"
    maxLength={10}
  />
  <small>Nhập theo ngày/tháng/năm</small>
</label>
       
      </>
    )}
  </div>
</section>

<section className="panel form-panel">
  <PanelTitle
    title="Thông tin sự cố"
    subtitle="Mô tả vấn đề và xác định mức độ ưu tiên xử lý"
  />
  <div className="form-grid">
    <label className="field">
      <span>Nhóm sự cố <b>*</b></span>
      <select
        required
        value={form.issue_category}
        onChange={(event) => updateForm("issue_category", event.target.value)}
      >
        {CATEGORIES.map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </label>

    <label className="field">
      <span>Mức ưu tiên <b>*</b></span>
      <select
        required
        value={form.priority}
        onChange={(event) => updateForm("priority", event.target.value)}
      >
        {PRIORITIES.map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </label>

    <label className="field full-width">
      <span>Mô tả sự cố <b>*</b></span>
      <textarea
        required
        rows={4}
        value={form.issue_description}
        onChange={(event) => updateForm("issue_description", event.target.value)}
        placeholder="Mô tả tình trạng thiết bị và vấn đề khách hàng gặp phải..."
      />
    </label>
  </div>
</section>

<div className="form-actions">
  <button className="primary-button" type="submit">
    <Plus size={18} />
    Tạo phiếu tiếp nhận
  </button>
</div>
                </form>
              </DataState>
            </>
          )}

          {page === "detail" && (
            <>
              <div className="page-heading">
                <div>
                  <button className="back-link" onClick={() => navigate("tickets")}>
                    <ArrowLeft size={16} /> Danh sách phiếu
                  </button>
                  <div className="eyebrow">CHI TIẾT YÊU CẦU</div>
                  <h1>{detail?.ticket_code || "Chi tiết phiếu"}</h1>
                  <p>Theo dõi thông tin và cập nhật trạng thái xử lý.</p>
                </div>
                <button className="button secondary" onClick={() => loadDetail(selectedId)}>
                  <RefreshCw size={16} /> Làm mới
                </button>
              </div>

              <DataState
                loading={detailLoading}
                error={detailError}
                empty={!detail && !detailLoading && !detailError}
                onRetry={() => loadDetail(selectedId)}
              >
                {detail && (
                  <div className="detail-grid">
                    <div className="detail-main">
                      <section className="panel">
                        <PanelTitle title="Thông tin phiếu" subtitle={`Mã phiếu: ${detail.ticket_code}`} />
                        <div className="detail-status-row">
                          <StatusBadge status={detail.status} />
                          <PriorityBadge priority={detail.priority} />
                        </div>
                        <div className="detail-fields">
                          <InfoField label="Khách hàng" value={detail.customer_name} />
                          <InfoField label="Thiết bị" value={detail.device_name} />
                          <InfoField label="Mã serial" value={detail.serial_number} />
                          <InfoField label="Nhóm sự cố" value={labelOf(CATEGORIES, detail.issue_category)} />
                          <InfoField label="Ngày tiếp nhận" value={formatDate(detail.created_at)} />
                          <InfoField label="Hạn SLA" value={formatDate(detail.sla_due_at)} />
                          <div className="info-field full-width">
                            <span>Mô tả sự cố</span>
                            <p>{detail.issue_description}</p>
                          </div>
                        </div>
                      </section>

                      <section className="panel">
                        <PanelTitle title="Lịch sử trạng thái" subtitle="Nhật ký thay đổi trạng thái của phiếu" />
                        {history.length === 0 ? (
                          <div className="empty-inline">Chưa có lịch sử trạng thái.</div>
                        ) : (
                          <div className="timeline">
                            {history.map((item, index) => (
                              <div className="timeline-item" key={item.log_id || `${item.changed_at}-${index}`}>
                                <div className="timeline-dot"><CheckCircle2 size={15} /></div>
                                <div className="timeline-content">
                                  <strong>{labelOf(STATUSES, item.new_status)}</strong>
                                  <span>{formatDate(item.changed_at)}</span>
                                  {item.old_status && (
                                    <p>Trước đó: {labelOf(STATUSES, item.old_status)}</p>
                                  )}
                                  {item.note && <p>{item.note}</p>}
                                  <small>Người cập nhật: {item.changed_by || "system"}</small>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </section>
                    </div>

                    <div className="detail-side">
                      <section className="panel">
                        <PanelTitle title="Cập nhật trạng thái" subtitle="Thay đổi tiến độ xử lý phiếu" />
                        <form className="status-form" onSubmit={updateTicketStatus}>
                          <label className="field">
                            <span>Trạng thái mới</span>
                            <select name="status" defaultValue={detail.status}>
                              {STATUSES.map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                              ))}
                            </select>
                          </label>
                          <label className="field">
                            <span>Ghi chú</span>
                            <textarea name="note" rows={3} placeholder="Nhập ghi chú cập nhật..." />
                          </label>
                          <button className="button primary full-button" disabled={saving}>
                            {saving ? <LoaderCircle className="spin" size={16} /> : <CheckCircle2 size={16} />}
                            Lưu trạng thái
                          </button>
                        </form>
                      </section>

                      <section className="panel quick-info">
                        <div className="quick-info-icon"><ShieldCheck size={22} /></div>
                        <h3>Theo dõi SLA</h3>
                        <p>Hạn xử lý được tính tự động theo mức ưu tiên của phiếu.</p>
                        <div className="quick-info-line">
                          <span>Mức ưu tiên</span>
                          <strong>{labelOf(PRIORITIES, detail.priority)}</strong>
                        </div>
                        <div className="quick-info-line">
                          <span>Hạn xử lý</span>
                          <strong>{formatDate(detail.sla_due_at)}</strong>
                        </div>
                      </section>
                    </div>
                  </div>
                )}
              </DataState>
            </>
          )}
        </div>

        <footer className="footer">
          <span>© 2026 Smart CRM Mekong Mobile</span>
          <span><i className="online-dot" /> Hệ thống quản lý bảo hành</span>
        </footer>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, detail }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className="stat-icon">{icon}</div>
        <span className="stat-live"><i className="online-dot" /> LIVE</span>
      </div>
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
      <span className="stat-detail">{detail}</span>
    </div>
  );
}

function PanelTitle({ title, subtitle }) {
  return (
    <div className="panel-title">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  return <span className={`badge status-${String(status || "").toLowerCase()}`}>{labelOf(STATUSES, status)}</span>;
}

function PriorityBadge({ priority }) {
  return <span className={`badge priority-${String(priority || "").toLowerCase()}`}>{labelOf(PRIORITIES, priority)}</span>;
}

function TicketTable({ tickets, onSelect }) {
  if (!tickets.length) {
    return (
      <div className="state-box table-empty">
        <Ticket size={30} />
        <h3>Không có phiếu phù hợp</h3>
        <p>Thử thay đổi từ khóa hoặc bộ lọc trạng thái.</p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="ticket-table">
        <thead>
          <tr>
            <th>MÃ PHIẾU</th>
            <th>KHÁCH HÀNG / THIẾT BỊ</th>
            <th>NHÓM SỰ CỐ</th>
            <th>ƯU TIÊN</th>
            <th>TRẠNG THÁI</th>
            <th>HẠN SLA</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.ticket_id} onClick={() => onSelect(ticket.ticket_id)}>
              <td>
                <strong className="ticket-code">{ticket.ticket_code}</strong>
                <span className="table-sub">#{ticket.ticket_id}</span>
              </td>
              <td>
                <div className="customer-cell">
                  <div className="device-icon"><MonitorSmartphone size={17} /></div>
                  <div>
                    <strong>{ticket.customer_name}</strong>
                    <span>{ticket.device_name} · {ticket.serial_number}</span>
                  </div>
                </div>
              </td>
              <td>{labelOf(CATEGORIES, ticket.issue_category)}</td>
              <td><PriorityBadge priority={ticket.priority} /></td>
              <td><StatusBadge status={ticket.status} /></td>
              <td className="date-cell">{formatDate(ticket.sla_due_at)}</td>
              <td><button className="row-arrow" aria-label="Xem chi tiết"><ArrowLeft size={16} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InfoField({ label, value }) {
  return (
    <div className="info-field">
      <span>{label}</span>
      <strong>{value || "—"}</strong>
    </div>
  );
}

export default App;
