const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const frontMatter = require('front-matter');
const markdownIt = require('markdown-it');
const nunjucks = require('nunjucks');
const moment = require('moment');

// Initialize markdown parser
const md = markdownIt({
  html: true,
  linkify: true,
  typographer: true
});

// Configure Nunjucks
nunjucks.configure('src/templates', {
  autoescape: true,
  noCache: true
});

// Ensure directories exist
fs.ensureDirSync(path.join(__dirname, '../public'));
fs.ensureDirSync(path.join(__dirname, '../public/posts'));
fs.ensureDirSync(path.join(__dirname, '../public/categories'));

// Clean public directory (except images)
const publicFiles = glob.sync(path.join(__dirname, '../public/**/*'), { 
  ignore: [path.join(__dirname, '../public/images/**/*')],
  nodir: true 
});
publicFiles.forEach(file => fs.removeSync(file));

// Copy static assets
fs.copySync(path.join(__dirname, '../src/css'), path.join(__dirname, '../public/css'));
fs.copySync(path.join(__dirname, '../src/js'), path.join(__dirname, '../public/js'));
fs.ensureDirSync(path.join(__dirname, '../public/images'));

// If images directory exists, copy it
if (fs.existsSync(path.join(__dirname, '../src/images'))) {
  fs.copySync(path.join(__dirname, '../src/images'), path.join(__dirname, '../public/images'));
}

// Process all posts
const postsDir = path.join(__dirname, '../_content/posts');
const postsPattern = path.join(postsDir, '**/*.md');
const posts = [];

glob.sync(postsPattern).forEach(filePath => {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const parsed = frontMatter(fileContent);
  const slug = path.basename(filePath, '.md');
  
  const postData = {
    ...parsed.attributes,
    slug,
    content: md.render(parsed.body),
    excerpt: parsed.attributes.excerpt || '',
    date: parsed.attributes.date,
    formattedDate: moment(parsed.attributes.date).format('MMMM D, YYYY')
  };
  
  posts.push(postData);
  
  // Render individual post page
  const postHtml = nunjucks.render('post.html', { 
    post: postData,
    title: postData.title
  });
  
  fs.outputFileSync(
    path.join(__dirname, `../public/posts/${slug}.html`),
    postHtml
  );
});

// Sort posts by date (newest first)
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

// Process all categories
const categories = {};

posts.forEach(post => {
  const category = post.category;
  if (!categories[category]) {
    categories[category] = {
      name: category,
      slug: category,
      posts: []
    };
  }
  categories[category].posts.push(post);
});

// Generate category pages
Object.values(categories).forEach(category => {
  const categoryHtml = nunjucks.render('category.html', {
    category,
    title: `${category.name.charAt(0).toUpperCase() + category.name.slice(1)} News`
  });
  
  fs.outputFileSync(
    path.join(__dirname, `../public/categories/${category.slug}.html`),
    categoryHtml
  );
});

// Generate home page with featured and latest posts
const featuredPosts = posts.filter(post => post.featured).slice(0, 3);
const latestPosts = posts.slice(0, 6);

const homeHtml = nunjucks.render('index.html', {
  featuredPosts,
  latestPosts,
  categories: Object.values(categories),
  title: 'H4News - The Truth Unleashed'
});

fs.outputFileSync(
  path.join(__dirname, '../public/index.html'),
  homeHtml
);

// Generate archives page with all posts
const archiveHtml = nunjucks.render('archive.html', {
  posts,
  categories: Object.values(categories),
  title: 'Archives - H4News'
});

fs.outputFileSync(
  path.join(__dirname, '../public/archive.html'),
  archiveHtml
);

console.log(`Built ${posts.length} posts in ${Object.keys(categories).length} categories.`);
