# Just the Comments 💬

A simple web tool to extract and export comments from PDF documents. 100% private: no files or data leave the browser.

## 🎯 Purpose & Motivation

Ever found yourself needing to extract more than a few comments and annotations from a PDF document? That's exactly what **Just the Comments** solves.

Whether you're:
- **Reviewing manuscripts** and need to compile reviewer feedback and comments
- **Processing legal documents** with margin notes and commentary  
- **Managing collaborative documents** with team annotations and notes
- **Extracting comments** from any PDF with reviewer feedback

This tool gives you a clean, organized view of all comments with the ability to export them in multiple formats.

## ✨ Features

- 📄 **Drag & drop PDF upload** - Simple file handling with visual feedback
- 🔍 **Automatic comment extraction** - Finds PDF comments, notes, and text annotations (not tracked changes or corrections)
- 📊 **Clean data grid** - View comments with page numbers, authors, and timestamps
- 🎛️ **Column selection** - Choose which data to include in exports
- 📋 **Multiple export formats** - CSV, TXT, and copy-to-clipboard (including Excel-compatible)
- 🔄 **Row selection** - Export only specific comments you choose
- 🎨 **Modern UI** - Clean, responsive interface built with Material UI
- 💯 **Free** - 100% free. Forever.

## 🔒 Privacy & Security

**Your privacy is our priority:**

- ✅ **100% client-side processing** - Nothing leaves your browser
- ✅ **No data collection** - We don't track, store, or analyze your documents
- ✅ **No cookies** - No tracking cookies or session storage
- ✅ **Open source** - Full transparency in how your data is handled ([view source code](https://github.com/drheinheimer/just-the-comments))
- ✅ **No analytics** - No tracking scripts or third-party data sharing

Your PDFs are processed entirely within your browser using [PDF.js](https://mozilla.github.io/pdf.js/), the same technology that powers Firefox's built-in PDF viewer.

## 🚀 How to Use

1. **Upload a PDF** - Drag & drop or click to select a PDF with comments
2. **Review comments** - View extracted comments in an organized table
3. **Sort & filter** - Sort by page, author, modified date, or comment content to organize results
4. **Select columns** - Choose which information to include (Page, Author, Modified date, and/or Comment) - *Author and Modified date are hidden by default*
5. **Export data** - Copy to clipboard or download in different formats

## 🛠️ Technical Details

Built with modern web technologies:
- **[React 19](https://react.dev/versions#react-19)** + **[TypeScript](https://www.typescriptlang.org/)** for type-safe UI components
- **[Material UI (MUI)](https://mui.com/)** for consistent, accessible design
- **[PDF.js](https://mozilla.github.io/pdf.js/)** for client-side PDF processing
- **[Vite](https://vite.dev/)** for fast development and optimized builds

## 🤖 AI Collaboration & Authorship

This project represents a collaboration between human creativity and AI assistance--a relatively novel (starting ~2022) yet increasingly common mode of software development:

- **Human authorship**: Concept, requirements, design decisions, and all code review/approval
- **AI contribution**: ~99% of code generation via text prompts to Claude Sonnet 4, plus input on some design decisions based on known best practices
- **Development method**: Iterative prompt-driven development rather than manual coding
- **Documentation**: This README was also AI-drafted and human-refined

**On authorship**: While the AI generated most of the code, we consider this **human-authored** software. The human(s) provided the vision, requirements, architectural decisions, and quality control. The AI served as a sophisticated tool, like an IDE that writes code instead of just highlighting it.

This represents a new paradigm in software development where humans focus on *what* to build and *how* it should work, while AI handles much of the *implementation*. Every line of AI-generated code was reviewed, tested, and approved by human judgment.

## 🤝 Contributing

Found a bug or have a feature request? Feel free to:
- [Open an issue on GitHub](https://github.com/drheinheimer/just-the-comments/issues)
- Submit a pull request
- Suggest improvements

## 💭 Origin Story

**Personal motivation**: This tool was born from the frustration of reviewing academic journals—making detailed notes in PDF comments, then spending precious time manually pulling those notes into my review. I used to rely on [Sumnotes](https://www.sumnotes.net), but as it grew and became more expensive, I needed a simple, free alternative focused specifically on PDF comment extraction.

**Commitment to free access**: Unlike commercial alternatives, this tool will always be 100% free, though [donations welcome](https://ko-fi.com/davidrheinheimer) ☕ 🙏

## 📝 License

MIT License - feel free to use this code for your own projects!

---

*Made with ❤️ for everyone who's ever had to manually copy comments from a PDF*
