import { ExecArgs } from "@medusajs/framework/types"
import { BLOG_MODULE } from "../modules/blog"
import BlogModuleService from "../modules/blog/service"

/**
 * 博客种子数据脚本
 * 运行: npx medusa exec ./src/scripts/seed-blog.ts
 */
export default async function seedBlog({ container }: ExecArgs) {
  const blogService: BlogModuleService = container.resolve(BLOG_MODULE)

  console.log("Seeding blog posts...")

  const posts = [
    // English posts
    {
      title: "The Complete Guide to Smart Helmet Features",
      slug: "smart-helmet-features-guide",
      excerpt:
        "Discover how integrated LED lights, crash detection, and Bluetooth connectivity work together to keep you safe on every ride.",
      content: `
<p>Smart helmets represent the next generation of cycling safety. Unlike traditional helmets that only protect on impact, smart helmets actively work to prevent accidents and get you help when you need it.</p>

<h2>Integrated LED Lighting</h2>
<p>360° visibility is the cornerstone of smart helmet safety. DLL helmets feature front and rear LED lights that can be seen from over 500 meters away. Automatic brake lights activate when you slow down, and turn signals communicate your intentions to drivers.</p>

<h2>Crash Detection & SOS</h2>
<p>Built-in accelerometers detect hard impacts in real-time. After a detected crash, a safety check timer activates in the companion app. If you don't respond within 60 seconds, an SOS text with your GPS location is sent automatically to your emergency contacts.</p>

<h2>MIPS Brain Protection</h2>
<p>The Multi-directional Impact Protection System (MIPS) reduces rotational forces during angled impacts. This technology provides superior brain protection that goes beyond standard certification requirements.</p>

<h2>Bluetooth Audio</h2>
<p>Stay connected without earbuds. Built-in speakers and microphone support music, navigation prompts, and hands-free calls. The open-ear design lets you hear traffic and your surroundings at all times.</p>

<h2>All-Day Battery</h2>
<p>With 12+ hours of battery life and USB-C fast charging (0 to 80% in 45 minutes), your helmet is ready whenever you are. A single charge covers even the longest rides.</p>
      `.trim(),
      cover_image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=630&fit=crop",
      author: "DLL Team",
      status: "published" as const,
      tags: ["guide", "safety", "technology"],
      locale: "en",
      published_at: new Date("2026-03-15"),
    },
    {
      title: "5 Essential Tips for Safe Urban Cycling",
      slug: "safe-urban-cycling-tips",
      excerpt:
        "City cycling can be challenging. Here are 5 tips from experienced riders and safety experts to help you stay safe on busy streets.",
      content: `
<p>Urban cycling is on the rise, and for good reason — it's fast, healthy, and eco-friendly. But city streets come with unique challenges. Here are five essential tips for staying safe.</p>

<h2>1. Be Visible, Always</h2>
<p>Visibility is your best defense. Wear bright colors during the day and reflective gear at night. A smart helmet with integrated LED lights makes you visible from all angles, even in daylight.</p>

<h2>2. Ride Predictably</h2>
<p>Signal your turns, maintain a steady speed, and avoid sudden movements. Drivers anticipate predictable behavior — surprises lead to accidents.</p>

<h2>3. Take the Lane When Needed</h2>
<p>Don't hug the curb. When the road is too narrow for cars to pass safely, take the full lane. It's legal in most jurisdictions and forces drivers to change lanes to pass you.</p>

<h2>4. Watch for Doors</h2>
<p>The "door zone" — the area next to parked cars where doors can suddenly open — is one of the most dangerous spots for cyclists. Ride at least 1 meter away from parked vehicles.</p>

<h2>5. Use Technology to Your Advantage</h2>
<p>Modern safety gear goes beyond the basics. Smart helmets with crash detection, turn signals, and automatic brake lights add layers of protection that traditional gear simply can't match.</p>
      `.trim(),
      cover_image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=1200&h=630&fit=crop",
      author: "DLL Team",
      status: "published" as const,
      tags: ["safety", "tips", "urban"],
      locale: "en",
      published_at: new Date("2026-03-20"),
    },
    {
      title: "DLL X1 Pro: What's New in Our Flagship Helmet",
      slug: "dll-x1-pro-whats-new",
      excerpt:
        "Introducing the DLL X1 Pro — our most advanced smart helmet yet. Here's everything that's new and improved.",
      content: `
<p>We're excited to introduce the DLL X1 Pro, the latest evolution of our flagship smart helmet. Built on rider feedback and years of research, the X1 Pro sets a new standard for smart cycling safety.</p>

<h2>Brighter LEDs</h2>
<p>The X1 Pro features 40% brighter LEDs compared to the previous generation. The new light array provides true 360° visibility with wider beam angles and smoother light distribution.</p>

<h2>Improved Crash Detection</h2>
<p>Our updated algorithm reduces false positives by 85% while maintaining the same level of sensitivity for real impacts. The new dual-accelerometer system provides more accurate crash detection in all riding conditions.</p>

<h2>Lighter Weight</h2>
<p>At just 380g, the X1 Pro is 15% lighter than its predecessor. We achieved this through a new composite shell design that maintains the same impact protection with less material.</p>

<h2>Extended Battery Life</h2>
<p>15 hours of battery life (up from 12) with the same USB-C fast charging. That's enough for a week of commuting on a single charge.</p>

<h2>Better Audio</h2>
<p>Redesigned speakers deliver richer sound and clearer calls. The new noise-canceling microphone ensures your voice comes through clearly, even at high speeds.</p>
      `.trim(),
      cover_image: "https://images.unsplash.com/photo-1605235186583-a8272b71f9a7?w=1200&h=630&fit=crop",
      author: "DLL Team",
      status: "published" as const,
      tags: ["product", "news"],
      locale: "en",
      published_at: new Date("2026-03-25"),
    },

    // Chinese posts
    {
      title: "智能头盔功能完全指南",
      slug: "smart-helmet-features-guide-zh",
      excerpt:
        "了解集成 LED 灯光、碰撞检测和蓝牙连接如何协同工作，保障您每次骑行的安全。",
      content: `
<p>智能头盔代表了骑行安全的下一代产品。与仅在撞击时提供保护的传统头盔不同，智能头盔能主动预防事故，并在您需要时获得帮助。</p>

<h2>集成 LED 照明</h2>
<p>360° 可见性是智能头盔安全的基石。DLL 头盔配备前后 LED 灯光，可在 500 米外被看到。自动刹车灯在减速时激活，转向灯向驾驶员传达您的意图。</p>

<h2>碰撞检测与 SOS</h2>
<p>内置加速度计实时检测剧烈撞击。检测到碰撞后，伴侣应用中的安全检查计时器会激活。如果您在 60 秒内没有响应，带有 GPS 位置的 SOS 短信将自动发送给您的紧急联系人。</p>

<h2>MIPS 大脑保护</h2>
<p>多方向撞击保护系统（MIPS）可减少倾斜撞击时的旋转力。该技术提供超越标准认证要求的卓越大脑保护。</p>

<h2>蓝牙音频</h2>
<p>无需耳塞即可保持连接。内置扬声器和麦克风支持音乐、导航提示和免提通话。开放式耳道设计让您随时听到交通和周围环境的声音。</p>

<h2>全天续航</h2>
<p>超过 12 小时的电池续航和 USB-C 快速充电（45 分钟从 0 充至 80%），您的头盔随时准备就绪。单次充电可覆盖最长的骑行路线。</p>
      `.trim(),
      cover_image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=630&fit=crop",
      author: "DLL 团队",
      status: "published" as const,
      tags: ["指南", "安全", "科技"],
      locale: "zh",
      published_at: new Date("2026-03-15"),
    },
    {
      title: "城市骑行安全的 5 个必备技巧",
      slug: "safe-urban-cycling-tips-zh",
      excerpt:
        "城市骑行充满挑战。以下是来自资深骑手和安全专家的 5 个技巧，帮助您在繁忙街道上安全骑行。",
      content: `
<p>城市骑行正在兴起，这有充分的理由——它快速、健康且环保。但城市街道带来了独特的挑战。以下是保持安全的五个基本技巧。</p>

<h2>1. 始终保持可见</h2>
<p>可见性是您最好的防护。白天穿亮色衣物，夜间穿反光装备。配备集成 LED 灯的智能头盔让您从各个角度可见，即使在白天也是如此。</p>

<h2>2. 骑行要可预测</h2>
<p>发出转弯信号，保持稳定速度，避免突然动作。驾驶员会预期可预测的行为——突发状况容易导致事故。</p>

<h2>3. 必要时占据整条车道</h2>
<p>不要紧贴路缘。当道路太窄，汽车无法安全超过您时，占据整条车道。这在大多数地区是合法的，迫使驾驶员变道超车。</p>

<h2>4. 注意车门</h2>
<p>"开门区"——停靠车辆旁边车门可能突然打开的区域——是骑行者最危险的地方之一。与停靠车辆保持至少 1 米的距离。</p>

<h2>5. 利用科技优势</h2>
<p>现代安全装备超越了基本功能。配备碰撞检测、转向灯和自动刹车灯的智能头盔增加了传统装备无法匹配的保护层。</p>
      `.trim(),
      cover_image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=1200&h=630&fit=crop",
      author: "DLL 团队",
      status: "published" as const,
      tags: ["安全", "技巧", "城市"],
      locale: "zh",
      published_at: new Date("2026-03-20"),
    },
    {
      title: "DLL X1 Pro：旗舰头盔的全新升级",
      slug: "dll-x1-pro-whats-new-zh",
      excerpt:
        "介绍 DLL X1 Pro——我们迄今为止最先进的智能头盔。了解所有新功能和改进。",
      content: `
<p>我们很高兴推出 DLL X1 Pro，这是我们旗舰智能头盔的最新进化。基于骑手反馈和多年研究，X1 Pro 为智能骑行安全树立了新标准。</p>

<h2>更亮的 LED</h2>
<p>X1 Pro 配备比上一代亮 40% 的 LED。新的灯光阵列提供真正的 360° 可见性，具有更宽的光束角度和更平滑的光线分布。</p>

<h2>改进的碰撞检测</h2>
<p>我们更新的算法将误报减少了 85%，同时保持了对真实撞击的相同灵敏度。新的双加速度计系统在所有骑行条件下提供更准确的碰撞检测。</p>

<h2>更轻的重量</h2>
<p>仅 380 克，X1 Pro 比前代产品轻 15%。我们通过新的复合外壳设计实现了这一点，在使用更少材料的同时保持相同的撞击保护。</p>

<h2>延长的电池续航</h2>
<p>15 小时的电池续航（从 12 小时提升），配备相同的 USB-C 快速充电。这足以满足一周的通勤需求，只需一次充电。</p>

<h2>更好的音频</h2>
<p>重新设计的扬声器提供更丰富的声音和更清晰的通话。新的降噪麦克风确保即使在高速骑行时，您的声音也能清晰传达。</p>
      `.trim(),
      cover_image: "https://images.unsplash.com/photo-1605235186583-a8272b71f9a7?w=1200&h=630&fit=crop",
      author: "DLL 团队",
      status: "published" as const,
      tags: ["产品", "新闻"],
      locale: "zh",
      published_at: new Date("2026-03-25"),
    },
  ]

  for (const post of posts) {
    // Check if post already exists
    const existing = await blogService.listBlogPosts({ slug: post.slug })
    if (existing.length > 0) {
      console.log(`  ⏭ Post already exists: ${post.title}`)
      continue
    }

    await blogService.createBlogPosts(post)
    console.log(`  ✓ Created: ${post.title}`)
  }

  console.log("Blog seeding complete!")
}
