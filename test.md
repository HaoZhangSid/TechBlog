# Markdown Syntax Showcase

This document demonstrates various Markdown syntax elements for testing rendering.

## Headings

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

## Paragraphs

This is a regular paragraph. It contains text that will be rendered as a single block.

This is another paragraph. Paragraphs are separated by one or more blank lines.

## Text Formatting

This text is **bold**.
This text is *italic*.
This text is ***bold and italic***.
This text is ~~strikethrough~~.

## Lists

### Unordered List

* Item one
* Item two
  * Nested item A
  * Nested item B
* Item three

### Ordered List

1. First item
2. Second item
3. Third item
   1. Nested ordered item 1
   2. Nested ordered item 2

## Links

Visit [Google](https://www.google.com).
Visit [OpenAI](https://www.openai.com "OpenAI Website").

## Images

![Alt text for image](https://via.placeholder.com/150 "Placeholder Image")

## Code

### Inline Code

Here is some `inline code`.

### Fenced Code Block

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet("World");
```

## Blockquotes

> This is a blockquote.
> It can span multiple lines.
> > Nested blockquote.

## Tables

| Header 1 | Header 2 | Header 3 |
| -------- | -------- | -------- |
| Row 1 Col 1 | Row 1 Col 2 | Row 1 Col 3 |
| Row 2 Col 1 | Row 2 Col 2 | Row 2 Col 3 |

## Horizontal Rule

---

***

---

## Task List (GitHub Flavored Markdown)

- [x] Completed task
- [ ] Incomplete task
- [ ] Another incomplete task

## Getting Started with Express and Handlebars

Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

Handlebars is a simple templating language. It uses a template and an input object to generate HTML or other text formats. Handlebars templates look like regular text with embedded Handlebars expressions.

Combining Express with Handlebars allows you to easily render dynamic HTML pages on the server side.

**Basic Setup:**

1.  **Install packages:**

    ```bash
    npm install express express-handlebars
    ```

2.  **Server setup (server.js):**

    ```javascript
    const express = require('express');
    const exphbs = require('express-handlebars');
    const app = express();

    // Configure Handlebars
    app.engine('handlebars', exphbs.engine({
      defaultLayout: 'main'
    }));
    app.set('view engine', 'handlebars');

    // Define a simple route
    app.get('/', (req, res) => {
      res.render('home', {
        title: 'Welcome!',
        message: 'Hello from Express and Handlebars!'
      });
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    ```

3.  **Create a layout file (views/layouts/main.hbs):**

    ```html
    <!DOCTYPE html>
    <html>
    <head>
        <title>{{title}}</title>
    </head>
    <body>
        {{{body}}}
    </body>
    </html>
    ```

4.  **Create a view file (views/home.hbs):**

    ```html
    <h1>{{message}}</h1>
    ```

This basic setup shows how to integrate Express and Handlebars to render a simple dynamic page.
