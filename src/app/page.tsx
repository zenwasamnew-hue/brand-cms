/**
 * 根页面 - 默认重定向到后台
 * 未来：这里会变成前台官网首页
 */
import { redirect } from 'next/navigation';

export default function Home() {
  // 临时：直接跳转到后台登录页
  redirect('/admin');
}
