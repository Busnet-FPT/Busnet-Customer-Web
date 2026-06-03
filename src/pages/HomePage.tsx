function HomePage() {
  return (
    <section className="rounded-2xl bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold text-slate-900">
        Đặt vé xe khách dễ dàng cùng BusNet
      </h1>

      <p className="mt-3 max-w-2xl text-slate-600">
        Tìm chuyến xe, chọn ghế, đặt vé và quản lý chuyến đi của bạn trong một nền tảng duy nhất.
      </p>

      <div className="mt-8 grid gap-4 rounded-xl border bg-slate-50 p-4 md:grid-cols-4">
        <input
          className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
          placeholder="Điểm đi"
        />
        <input
          className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
          placeholder="Điểm đến"
        />
        <input
          type="date"
          className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
        />
        <button className="rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700">
          Tìm chuyến
        </button>
      </div>
    </section>
  )
}

export default HomePage