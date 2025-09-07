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
- 🎨 **Modern UI** - Clean, responsive interface built with Material-UI

## 🔒 Privacy & Security

**Your privacy is our priority:**

- ✅ **100% client-side processing** - PDFs never leave your browser
- ✅ **No data collection** - We don't track, store, or analyze your documents
- ✅ **No server uploads** - Everything happens locally in your browser
- ✅ **No cookies** - No tracking cookies or session storage
- ✅ **Open source** - Full transparency in how your data is handled
- ✅ **No analytics** - No tracking scripts or third-party data sharing

Your PDFs are processed entirely within your browser using PDF.js, the same technology that powers Firefox's built-in PDF viewer.

## 🚀 How to Use

1. **Upload a PDF** - Drag & drop or click to select a PDF with comments
2. **Review comments** - View extracted comments in an organized table
3. **Sort & filter** - Sort by page, author, date, or comment content to organize results
4. **Select columns** - Choose which information to include (Page, Author, Date, and/or Comment) - *Author and Date are hidden by default*
5. **Export data** - Download as CSV/TXT or copy to clipboard for pasting into Excel

## 🛠️ Technical Details

Built with modern web technologies:
- **React 18** + **TypeScript** for type-safe UI components
- **Material-UI (MUI)** for consistent, accessible design
- **PDF.js** for client-side PDF processing
- **Vite** for fast development and optimized builds

## � AI Collaboration & Authorship

This project represents a collaboration between human creativity and AI assistance--a relatively novel (starting ~2022) yet increasingly common mode of software development:

- **Human authorship**: Concept, requirements, design decisions, and all code review/approval
- **AI contribution**: ~99% of code generation via text prompts to Claude Sonnet 4 in Visual Studio Code, plus input on some design decisions based on known best practices
- **Development method**: Iterative prompt-driven development rather than manual coding
- **Documentation**: This README was also AI-drafted and human-reviewed

**On authorship**: While the AI generated most of the code, we consider this **human-authored** software. The human(s) provided the vision, requirements, architectural decisions, and quality control. The AI served as an incredibly sophisticated tool—like an IDE that writes code instead of just highlighting it.

This represents a new paradigm in software development where humans focus on *what* to build and *how* it should work, while AI handles much of the *implementation*. Every line of AI-generated code was reviewed, tested, and approved by human judgment.

## �🤝 Contributing

Found a bug or have a feature request? Feel free to:
- Open an issue on GitHub
- Submit a pull request
- Suggest improvements

## 📝 License

MIT License - feel free to use this code for your own projects!

---

*Made with ❤️ for everyone who's ever had to manually copy comments from a PDF*
