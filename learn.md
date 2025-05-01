# 技术博客平台开发指南 - 详细教程

## 第一部分：项目初始化与架构搭建

### 1. 初始化项目

首先，创建项目目录并初始化Node.js项目：

```bash
mkdir tech-blog
cd tech-blog
npm init -y
```

然后，安装核心依赖：

```bash
npm install express express-handlebars express-session connect-flash connect-mongo mongoose bcryptjs passport passport-local express-validator nodemailer dotenv slugify uuid
```

安装开发依赖：

```bash
npm install --save-dev nodemon concurrently postcss postcss-cli tailwindcss @tailwindcss/typography autoprefixer
```

创建基础目录结构：

```bash
mkdir config controllers middleware models public routes utils views
mkdir views/layouts views/partials public/css public/js src/css
```

### 2. 配置文件设置

**创建 .env 文件**

```plaintext
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/tech-blog

# Session Configuration
SESSION_SECRET=your_session_secret_here

# Server Configuration
PORT=3000
NODE_ENV=development

# Application URL (for generating links in emails)
APP_URL=http://localhost:3000

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your.email@gmail.com
```

**创建 .gitignore 文件**

```plaintext
node_modules/
.env
.DS_Store
*.log
public/css/styles.css
```

**设置 TailwindCSS 配置 (tailwind.config.js)**

```javascript
module.exports = {
  content: [
    './views/**/*.hbs',
    './public/**/*.js',
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            code: {
              backgroundColor: '#1E293B',
              borderRadius: '0.25rem',
              paddingTop: '0.125rem',
              paddingBottom: '0.125rem',
              paddingLeft: '0.25rem',
              paddingRight: '0.25rem',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
```

**设置 PostCSS 配置 (postcss.config.js)**

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
};
```

**创建 src/css/tailwind.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100;
  }
  h1 {
    @apply text-2xl font-bold mb-4;
  }
  h2 {
    @apply text-xl font-bold mb-3;
  }
}
```

### 3. 创建服务器入口点

**server.js - 主应用文件**

```javascript
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const flash = require('connect-flash');

// 导入自定义配置
const connectDB = require('./config/db');
const configurePassport = require('./config/passport');
const configureHandlebars = require('./config/handlebars');

// 连接数据库
connectDB();

// 配置Passport策略
configurePassport(passport);

const app = express();

// 配置Handlebars视图引擎
configureHandlebars(app);

// 提供静态文件服务
app.use(express.static('public'));

// 请求体解析中间件
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 配置会话
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret_for_safety',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1天
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

// Passport中间件
app.use(passport.initialize());
app.use(passport.session());

// Flash消息中间件
app.use(flash());

// 全局变量中间件
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  res.locals.currentYear = new Date().getFullYear(); // 用于布局中的页脚
  next();
});

// 导入并使用路由
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/admin', adminRoutes);

// 404处理
app.use((req, res) => {
  res.status(404).render('404');
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('Error occurred:', err.stack);
  const statusCode = err.status || 500;
  const errorMessage = process.env.NODE_ENV === 'production' 
    ? 'An unexpected error occurred' 
    : err.message;
  
  res.status(statusCode).render('error', {
    error: errorMessage,
    id: err.id || 'UNKNOWN'
  });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 4. 数据库配置

**config/db.js - 数据库连接**

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // 确保MONGODB_URI从.env加载
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI环境变量未设置');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB连接成功...');
  } catch (err) {
    console.error('MongoDB连接错误:', err.message);
    // 在生产环境下连接失败时退出进程
    if (process.env.NODE_ENV === 'production') {
      console.error('由于数据库连接失败，应用退出');
      process.exit(1);
    }
  }
};

module.exports = connectDB;
```

### 5. 定义数据模型

**models/User.js - 用户模型**

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 定义用户模式
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  initials: {
    type: String,
    maxLength: 2
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date,
    default: null
  }
});

// 保存前生成用户首字母缩写
UserSchema.pre('validate', function(next) {
  if (!this.initials && this.name) {
    // 从姓名中提取首字母
    this.initials = this.name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
  next();
});

// 保存前密码哈希处理
UserSchema.pre('save', async function(next) {
  // 仅当密码被修改或新建时哈希处理
  if (!this.isModified('password')) return next();
  
  try {
    // 生成盐值
    const salt = await bcrypt.genSalt(10);
    // 使用盐值哈希密码
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 比较密码方法（用于登录验证）
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 创建并导出User模型
const User = mongoose.model('User', UserSchema);
module.exports = User;
```

**models/Post.js - 博客文章模型**

```javascript
const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./User');

// 定义文章模式
const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  summary: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  slug: { type: String, required: true, unique: true, trim: true },
  content: { type: String, required: true },
  published: { type: Boolean, default: false }
});

// 保存前生成slug
postSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// 保存前更新updatedAt字段
postSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// 导出Post模型
const Post = mongoose.model('Post', postSchema);
module.exports = Post;
```

## 第二部分：认证系统实现

### 1. Passport认证配置

**config/passport.js - 认证策略配置**

```javascript
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = function(passport) {
  // 配置本地策略（使用邮箱和密码登录）
  passport.use(new LocalStrategy(
    { usernameField: 'email' }, // 使用email字段作为用户名
    async (email, password, done) => {
      console.log(`尝试认证用户：${email}`);
      try {
        // 在数据库中查找用户
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
          console.warn(`用户不存在：${email}`);
          return done(null, false, { message: '无效的凭证' });
        }

        // 比较密码
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          console.warn(`密码不匹配：${email}`);
          return done(null, false, { message: '无效的凭证' });
        }

        console.log(`用户认证成功：${email}`);
        return done(null, user);
      } catch (err) {
        console.error(`认证过程中出错：${email}:`, err);
        return done(err);
      }
    }
  ));

  // 序列化用户（存储用户ID到session）
  passport.serializeUser((user, done) => {
    console.log(`序列化用户ID：${user.id}`);
    done(null, user.id);
  });

  // 反序列化用户（从session中取出用户ID并查询用户信息）
  passport.deserializeUser(async (id, done) => {
    console.log(`反序列化用户ID：${id}`);
    try {
      const user = await User.findById(id);
      if (user) {
        // 转换为普通对象并确保必要属性
        const plainUser = {
          id: user.id,
          name: user.name || 'User', // 提供默认名称
          email: user.email,
          initials: user.initials || (user.name ? user.name.charAt(0).toUpperCase() : 'U') // 默认首字母
        };
        done(null, plainUser);
      } else {
        console.warn(`反序列化过程中未找到用户（ID：${id}）`);
        done(null, false);
      }
    } catch (err) {
      console.error(`反序列化用户时出错：${id}:`, err);
      done(err);
    }
  });
};
```

### 2. 认证中间件

**middleware/auth.js - 权限控制中间件**

```javascript
module.exports = {
  // 确保用户已登录
  isAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next(); // 用户已登录，继续下一个中间件/路由处理程序
    }
    // 用户未登录
    console.log('认证中间件：用户未认证，重定向到/login');
    req.flash('error_msg', '请登录后查看此资源。');
    res.redirect('/login');
  },

  // 确保用户未登录（用于登录/注册页面）
  isGuest: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next(); // 用户未登录，继续
    }
    console.log('认证中间件：已认证用户尝试访问游客路由，重定向到/admin/dashboard');
    res.redirect('/admin/dashboard'); 
  }
};
```

### 3. 令牌生成器

**utils/tokenGenerator.js - 安全令牌生成**

```javascript
const crypto = require('crypto');

/**
 * 生成随机的密码重置令牌
 * @returns {string} 随机生成的重置令牌
 */
exports.generateResetToken = () => {
  // 生成32个字节的随机字符串，并转为十六进制
  return crypto.randomBytes(32).toString('hex');
};

/**
 * 对令牌进行哈希处理
 * 在数据库中存储哈希后的令牌而非原始令牌，提高安全性
 * @param {string} token - 原始令牌
 * @returns {string} 哈希后的令牌
 */
exports.hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
```

## 第三部分：博客内容管理

### 1. 公共页面路由

**routes/index.js - 前台路由**

```javascript
const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

// 主页路由 - 显示博客文章列表
router.get('/', indexController.getHomePage);

// 文章详情页路由 - 通过slug查看单篇文章
router.get('/post/:slug', indexController.getPostBySlug);

// 关于页面路由 - 静态页面
router.get('/about', indexController.getAboutPage);

module.exports = router;
```

### 2. 前台控制器

**controllers/indexController.js - 前台控制器**

```javascript
const Post = require('../models/Post');
const User = require('../models/User');

// 获取主页（博客文章列表）
exports.getHomePage = async (req, res) => {
  try {
    // 查询已发布的文章，按创建时间倒序排列，并关联作者信息
    const posts = await Post.find({ published: true })
      .sort({ createdAt: -1 })
      .populate('author', 'name')
      .lean(); // 使用lean()获取轻量级JavaScript对象而非Mongoose文档
    
    // 格式化日期和处理摘要
    const formattedPosts = posts.map(post => {
      return {
        ...post,
        formattedDate: new Date(post.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        // 如果摘要过长，进行截断
        truncatedSummary: post.summary.length > 150 
          ? post.summary.substring(0, 150) + '...' 
          : post.summary
      };
    });
    
    // 渲染主页视图，传递文章数据
    res.render('index', {
      title: 'Tech Blog - Home',
      description: 'A blog about technology and programming',
      posts: formattedPosts,
      hasPosts: formattedPosts.length > 0
    });
  } catch (err) {
    console.error('获取首页文章时出错:', err);
    res.status(500).render('error', {
      error: 'Failed to load blog posts'
    });
  }
};

// 根据slug获取单篇文章
exports.getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    // 查找文章并关联作者信息
    const post = await Post.findOne({ slug, published: true })
      .populate('author', 'name')
      .lean();
    
    if (!post) {
      return res.status(404).render('404', {
        title: 'Post Not Found',
        description: 'The requested post could not be found'
      });
    }
    
    // 格式化日期
    const formattedPost = {
      ...post,
      formattedDate: new Date(post.createdAt).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
    
    // 渲染文章详情页
    res.render('post-details', {
      title: post.title,
      description: post.summary,
      post: formattedPost
    });
  } catch (err) {
    console.error('获取文章详情时出错:', err);
    res.status(500).render('error', {
      error: 'Failed to load the post'
    });
  }
};

// 获取关于页面
exports.getAboutPage = (req, res) => {
  res.render('about', {
    title: 'About Tech Blog',
    description: 'Learn more about our blog and mission'
  });
};
```

### 3. 管理路由

**routes/admin.js - 后台管理路由**

```javascript
const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth'); 
const adminController = require('../controllers/adminController');

// 渲染管理员仪表板 - 显示概览
router.get('/dashboard', isAuthenticated, adminController.getDashboard);

// 文章列表 - 管理所有文章
router.get('/posts', isAuthenticated, adminController.getPosts);

// 创建新文章页面
router.get('/posts/create', isAuthenticated, adminController.getCreatePost);

// 处理新文章创建
router.post('/posts/create', isAuthenticated, adminController.postCreatePost);

// 编辑文章页面
router.get('/posts/edit/:id', isAuthenticated, adminController.getEditPost);

// 处理文章更新
router.post('/posts/edit/:id', isAuthenticated, adminController.postEditPost);

// 删除文章
router.post('/posts/delete/:id', isAuthenticated, adminController.postDeletePost);

module.exports = router;
```

### 4. 管理控制器

**controllers/adminController.js - 后台管理控制器**

```javascript
const { validationResult } = require('express-validator');
const Post = require('../models/Post');
const User = require('../models/User');

// 获取管理员仪表板
exports.getDashboard = async (req, res) => {
  try {
    // 获取最近的5篇文章
    const recentPosts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    
    // 获取文章统计数据
    const stats = {
      totalPosts: await Post.countDocuments(),
      publishedPosts: await Post.countDocuments({ published: true }),
      draftPosts: await Post.countDocuments({ published: false })
    };
    
    // 渲染仪表板视图
    res.render('admin-dashboard', {
      title: 'Admin Dashboard',
      layout: 'admin', // 使用admin布局
      description: 'Blog administration dashboard',
      user: req.user,
      recentPosts,
      stats
    });
  } catch (err) {
    console.error('获取仪表板数据时出错:', err);
    req.flash('error_msg', 'Failed to load dashboard data');
    res.status(500).render('admin-dashboard', {
      title: 'Admin Dashboard',
      layout: 'admin',
      error: 'Failed to load dashboard data'
    });
  }
};

// 获取所有文章
exports.getPosts = async (req, res) => {
  try {
    // 查询所有文章并关联作者
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'name')
      .lean();
    
    // 格式化日期
    const formattedPosts = posts.map(post => ({
      ...post,
      formattedDate: new Date(post.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      statusClass: post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800',
      statusText: post.published ? 'Published' : 'Draft'
    }));
    
    // 渲染文章列表视图
    res.render('posts', {
      title: 'Manage Posts',
      layout: 'admin',
      description: 'Manage your blog posts',
      posts: formattedPosts,
      hasPosts: formattedPosts.length > 0
    });
  } catch (err) {
    console.error('获取文章列表时出错:', err);
    req.flash('error_msg', 'Failed to load posts');
    res.status(500).render('posts', {
      title: 'Manage Posts',
      layout: 'admin',
      error: 'Failed to load posts'
    });
  }
};

// 显示创建文章表单
exports.getCreatePost = (req, res) => {
  res.render('post-form', {
    title: 'Create Post',
    layout: 'admin',
    description: 'Create a new blog post',
    action: '/admin/posts/create',
    post: { title: '', summary: '', content: '', published: false },
    isNew: true
  });
};

// 处理创建文章
exports.postCreatePost = async (req, res) => {
  try {
    const { title, summary, content, published } = req.body;
    
    // 验证表单数据
    if (!title || !summary || !content) {
      req.flash('error_msg', 'Please fill in all required fields');
      return res.render('post-form', {
        title: 'Create Post',
        layout: 'admin',
        post: { title, summary, content, published: !!published },
        isNew: true
      });
    }
    
    // 创建新文章
    const newPost = new Post({
      title,
      summary,
      content,
      published: !!published, // 转换为布尔值
      author: req.user.id // 从认证用户信息获取ID
    });
    
    await newPost.save();
    req.flash('success_msg', 'Post created successfully');
    res.redirect('/admin/posts');
  } catch (err) {
    console.error('创建文章时出错:', err);
    req.flash('error_msg', 'Failed to create post');
    res.render('post-form', {
      title: 'Create Post',
      layout: 'admin',
      post: req.body,
      isNew: true,
      error: 'Failed to create post'
    });
  }
};

// 显示编辑文章表单
exports.getEditPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).lean();
    
    if (!post) {
      req.flash('error_msg', 'Post not found');
      return res.redirect('/admin/posts');
    }
    
    res.render('post-form', {
      title: 'Edit Post',
      layout: 'admin',
      description: 'Edit an existing blog post',
      post,
      action: `/admin/posts/edit/${post._id}`,
      isNew: false
    });
  } catch (err) {
    console.error('获取编辑文章表单时出错:', err);
    req.flash('error_msg', 'Failed to load post for editing');
    res.redirect('/admin/posts');
  }
};

// 处理更新文章
exports.postEditPost = async (req, res) => {
  try {
    const { title, summary, content, published } = req.body;
    
    // 验证表单数据
    if (!title || !summary || !content) {
      req.flash('error_msg', 'Please fill in all required fields');
      return res.render('post-form', {
        title: 'Edit Post',
        layout: 'admin',
        post: { 
          _id: req.params.id,
          title, 
          summary, 
          content, 
          published: !!published 
        },
        isNew: false
      });
    }
    
    // 更新文章
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      req.flash('error_msg', 'Post not found');
      return res.redirect('/admin/posts');
    }
    
    post.title = title;
    post.summary = summary;
    post.content = content;
    post.published = !!published;
    
    await post.save();
    req.flash('success_msg', 'Post updated successfully');
    res.redirect('/admin/posts');
  } catch (err) {
    console.error('更新文章时出错:', err);
    req.flash('error_msg', 'Failed to update post');
    res.redirect(`/admin/posts/edit/${req.params.id}`);
  }
};

// 处理删除文章
exports.postDeletePost = async (req, res) => {
  try {
    const result = await Post.findByIdAndDelete(req.params.id);
    
    if (!result) {
      req.flash('error_msg', 'Post not found');
    } else {
      req.flash('success_msg', 'Post deleted successfully');
    }
    
    res.redirect('/admin/posts');
  } catch (err) {
    console.error('删除文章时出错:', err);
    req.flash('error_msg', 'Failed to delete post');
    res.redirect('/admin/posts');
  }
};
```

### 5. 管理员初始化

**utils/initAdmin.js - 创建初始管理员账户**

```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

// 默认管理员凭据 - 生产环境中请更改!
const defaultAdmin = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'adminpassword'
};

async function initializeAdmin() {
  try {
    // 连接到MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('已连接到MongoDB，准备初始化管理员');
    
    // 检查是否已存在管理员用户
    const existingAdmin = await User.findOne({ email: defaultAdmin.email });
    
    if (existingAdmin) {
      console.log('管理员用户已存在，跳过初始化。');
    } else {
      // 创建新管理员用户
      const newAdmin = new User(defaultAdmin);
      await newAdmin.save();
      console.log('✅ 默认管理员用户创建成功:');
      console.log(`   邮箱: ${defaultAdmin.email}`);
      console.log(`   密码: ${defaultAdmin.password}`);
      console.log('   首次登录后请更改这些凭据！');
    }
  } catch (err) {
    console.error('❌ 管理员初始化错误:', err);
  } finally {
    // 关闭数据库连接
    await mongoose.connection.close();
    console.log('数据库连接已关闭');
  }
}

// 运行初始化函数
initializeAdmin().catch(console.error);
```

## 第四部分：用户认证实现

### 1. 认证路由

**routes/auth.js - 认证相关路由**

```javascript
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { isGuest, isAuthenticated } = require('../middleware/auth');

// 注册页面路由 - 仅供未登录用户访问
router.get('/register', isGuest, authController.getRegister);

// 处理注册请求 - 包含表单验证
router.post('/register', [
  // 表单验证规则
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  })
], isGuest, authController.postRegister);

// 登录页面路由 - 仅供未登录用户访问
router.get('/login', isGuest, authController.getLogin);

// 处理登录请求
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], isGuest, authController.postLogin);

// 忘记密码页面
router.get('/forgot-password', isGuest, authController.getForgotPassword);

// 处理忘记密码请求
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email')
], isGuest, authController.postForgotPassword);

// 重置密码页面 - 通过令牌访问
router.get('/reset-password/:token', isGuest, authController.getResetPassword);

// 处理重置密码请求
router.post('/reset-password/:token', [
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  })
], isGuest, authController.postResetPassword);

// 注销路由 - 仅供已登录用户访问
router.get('/logout', isAuthenticated, authController.getLogout);

module.exports = router;
```

### 2. 认证控制器

**controllers/authController.js - 处理用户认证逻辑**

```javascript
const { validationResult } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateResetToken, hashToken } = require('../utils/tokenGenerator');
const emailService = require('../utils/emailService');

// 渲染注册页面
exports.getRegister = (req, res) => {
  res.render('register', {
    title: 'Create Account',
    description: 'Join our tech blog community'
  });
};

// 处理注册请求
exports.postRegister = async (req, res) => {
  try {
    // 验证表单数据
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('register', {
        title: 'Create Account',
        description: 'Join our tech blog community',
        errors: errors.array(),
        user: {
          name: req.body.name,
          email: req.body.email
        }
      });
    }

    const { name, email, password } = req.body;

    // 检查邮箱是否已注册
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).render('register', {
        title: 'Create Account',
        description: 'Join our tech blog community',
        errorMessage: 'Email is already registered',
        user: {
          name,
          email
        }
      });
    }

    // 创建新用户
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password
    });

    await newUser.save();
    
    // 注册成功后显示成功消息并重定向到登录页面
    req.flash('success_msg', 'Registration successful! You can now log in.');
    res.redirect('/login');
  } catch (err) {
    console.error('注册过程中出错:', err);
    
    res.status(500).render('register', {
      title: 'Create Account',
      description: 'Join our tech blog community',
      errorMessage: 'An error occurred during registration. Please try again later.',
      user: {
        name: req.body.name,
        email: req.body.email
      }
    });
  }
};

// 渲染登录页面
exports.getLogin = (req, res) => {
  res.render('login', {
    title: 'Log In',
    description: 'Log in to access your dashboard'
  });
};

// 处理登录请求
exports.postLogin = (req, res, next) => {
  // 验证表单数据
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('login', {
      title: 'Log In',
      description: 'Log in to access your dashboard',
      errors: errors.array(),
      email: req.body.email
    });
  }

  // 使用Passport进行认证
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('登录过程中出错:', err);
      return next(err);
    }
    
    if (!user) {
      // 认证失败
      return res.status(401).render('login', {
        title: 'Log In',
        description: 'Log in to access your dashboard',
        errorMessage: info.message || 'Invalid credentials',
        email: req.body.email
      });
    }
    
    // 认证成功，登录用户
    req.logIn(user, (err) => {
      if (err) {
        console.error('Session创建过程中出错:', err);
        return next(err);
      }
      
      return res.redirect('/admin/dashboard');
    });
  })(req, res, next);
};

// 处理注销请求
exports.getLogout = (req, res, next) => {
  // 调用req.logout并处理回调
  req.logout((err) => {
    if (err) {
      console.error('注销过程中出错:', err);
      return next(err);
    }
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
  });
};

// 渲染忘记密码页面
exports.getForgotPassword = (req, res) => {
  res.render('forgot-password', {
    title: 'Forgot Password',
    description: 'Request a password reset link'
  });
};

// 处理忘记密码请求
exports.postForgotPassword = async (req, res) => {
  try {
    // 验证表单数据
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('forgot-password', {
        title: 'Forgot Password',
        description: 'Request a password reset link',
        errors: errors.array(),
        email: req.body.email
      });
    }

    const { email } = req.body;
    
    // 查找用户
    const user = await User.findOne({ email: email.toLowerCase() });
    
    // 即使没找到用户也显示成功消息，防止用户枚举攻击
    if (!user) {
      req.flash('success_msg', 'If an account with that email exists, a password reset link has been sent.');
      return res.redirect('/login');
    }
    
    // 生成并存储密码重置令牌
    const resetToken = generateResetToken();
    const hashedToken = hashToken(resetToken);
    
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1小时后过期
    await user.save();
    
    // 构建重置URL
    const resetUrl = `${process.env.APP_URL}/reset-password/${resetToken}`;
    
    // 发送重置邮件
    const emailSent = await emailService.sendPasswordResetEmail(
      user.email,
      user.name,
      resetUrl
    );
    
    if (emailSent) {
      req.flash('success_msg', 'Password reset link has been sent to your email');
    } else {
      req.flash('error_msg', 'Failed to send password reset email. Please try again later.');
    }
    
    res.redirect('/login');
  } catch (err) {
    console.error('密码重置请求过程中出错:', err);
    req.flash('error_msg', 'An error occurred. Please try again later.');
    res.redirect('/forgot-password');
  }
};

// 渲染重置密码页面
exports.getResetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const hashedToken = hashToken(token);
    
    // 查找具有有效重置令牌的用户
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      req.flash('error_msg', 'Password reset token is invalid or has expired');
      return res.redirect('/forgot-password');
    }
    
    res.render('reset-password', {
      title: 'Reset Password',
      description: 'Set a new password for your account',
      token
    });
  } catch (err) {
    console.error('访问密码重置页面过程中出错:', err);
    req.flash('error_msg', 'An error occurred. Please try again later.');
    res.redirect('/forgot-password');
  }
};

// 处理重置密码请求
exports.postResetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    // 验证表单数据
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('reset-password', {
        title: 'Reset Password',
        description: 'Set a new password for your account',
        token,
        errors: errors.array()
      });
    }
    
    const hashedToken = hashToken(token);
    
    // 查找具有有效重置令牌的用户
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      req.flash('error_msg', 'Password reset token is invalid or has expired');
      return res.redirect('/forgot-password');
    }
    
    // 更新密码并清除重置令牌
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    
    req.flash('success_msg', 'Your password has been updated! You can now log in with your new password.');
    res.redirect('/login');
  } catch (err) {
    console.error('重置密码过程中出错:', err);
    req.flash('error_msg', 'An error occurred. Please try again later.');
    res.redirect(`/reset-password/${req.params.token}`);
  }
};
```

### 3. 电子邮件服务

**utils/emailService.js - 处理邮件发送**

```javascript
const nodemailer = require('nodemailer');

// 创建邮件传输器
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === '465', // 如果端口为465，则启用SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// 发送密码重置邮件
exports.sendPasswordResetEmail = async (email, name, resetUrl) => {
  try {
    const transporter = createTransporter();
    
    // 验证邮件发送配置
    await transporter.verify();
    
    // 邮件内容
    const mailOptions = {
      from: `"Tech Blog" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hello ${name},</p>
          <p>You requested to reset your password for your Tech Blog account.</p>
          <p>Please click the button below to reset your password. This link is valid for 1 hour.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
          </div>
          <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
          <p>Regards,<br>The Tech Blog Team</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #666; text-align: center;">If the button above doesn't work, copy and paste this URL into your browser: ${resetUrl}</p>
        </div>
      `
    };
    
    // 发送邮件
    const info = await transporter.sendMail(mailOptions);
    console.log('密码重置邮件已发送:', info.messageId);
    return true;
  } catch (err) {
    console.error('发送密码重置邮件时出错:', err);
    return false;
  }
};

// 发送欢迎邮件（可选功能）
exports.sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = createTransporter();
    
    // 验证邮件发送配置
    await transporter.verify();
    
    // 邮件内容
    const mailOptions = {
      from: `"Tech Blog" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Welcome to Tech Blog!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Tech Blog!</h2>
          <p>Hello ${name},</p>
          <p>Thank you for registering an account with Tech Blog. We're excited to have you as part of our community!</p>
          <p>With your account, you can:</p>
          <ul>
            <li>Publish and manage your tech articles</li>
            <li>Customize your writer profile</li>
            <li>Interact with readers through comments</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.APP_URL}/login" style="background-color: #4F46E5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Log In to Your Account</a>
          </div>
          <p>If you have any questions or need assistance, feel free to reply to this email.</p>
          <p>Happy blogging!<br>The Tech Blog Team</p>
        </div>
      `
    };
    
    // 发送邮件
    const info = await transporter.sendMail(mailOptions);
    console.log('欢迎邮件已发送:', info.messageId);
    return true;
  } catch (err) {
    console.error('发送欢迎邮件时出错:', err);
    return false;
  }
};
```

### 4. 安全最佳实践

在实施用户认证系统时，我们采用了以下安全最佳实践：

1. **密码安全**：
   - 使用 bcryptjs 加密哈希存储密码，而非明文
   - 密码重置采用安全令牌，令牌经过哈希处理后才存储在数据库中
   - 强制实施最小密码长度（8个字符）
   - 密码重置链接具有1小时的有效期

2. **防止信息泄露**：
   - 错误信息通用化，不暴露用户是否存在
   - 密码重置流程对存在和不存在的邮箱返回相同消息
   - 数据验证错误消息不会暴露系统信息

3. **会话管理**：
   - 使用 express-session 和 MongoStore 安全存储会话信息
   - 设置合理的Cookie期限和安全选项
   - 在生产环境中启用 secure 和 httpOnly 标记

4. **访问控制**：
   - 通过中间件实施认证和授权检查
   - 适当的路由保护，确保只有已认证用户能访问受保护资源
   - 区分游客和已登录用户可访问的路由

5. **输入验证**：
   - 使用 express-validator 进行严格的输入验证
   - 规范化输入（如电子邮件小写化）
   - 验证所有用户输入，防止恶意输入和注入攻击

## 第五部分：前端界面实现
