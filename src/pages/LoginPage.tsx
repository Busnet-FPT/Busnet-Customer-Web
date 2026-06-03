function LoginPage() {
  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold">Đăng nhập</h1>

      <form className="mt-6 space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
        />

        <button className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700">
          Đăng nhập
        </button>
      </form>
    </div>
  )
}

export default LoginPage