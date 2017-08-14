export default function ({ store, route, redirect}) {
  if (!store.state.authUser) {
    let { fullPath } = route

    fullPath = encodeURIComponent(fullPath.substr(1))

    return redirect(`/wechat-redirect?visit=#{fullPath}`)
  }
}