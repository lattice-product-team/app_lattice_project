# Documentation Assets Directory

This directory stores all static visual assets, diagrams, mobile mockups, and desktop templates used throughout the Lattice documentation.

---

## 📂 Directory Structure

To maintain a highly professional presentation, please organize assets into the following subfolders:

- `templates/`: PSD, Figma, or raw vector templates for device frames (e.g., iPhone 15 Pro, MacBook Air).
- `mockups/`: Completed designs with app interfaces placed inside device templates.
- `screenshots/`: Clean, raw screenshots of the running mobile app or admin dashboard.
- `diagrams/`: Non-Mermaid static architecture flowcharts or database entity-relationship images.

---

## 🎨 Design & Framing Guidelines

To keep the documentation clean and state-of-the-art:

1. **Use Curated Device Frames:** Never upload raw screenshots with generic, standard browser address bars or bare emulator status bars. Always wrap them in premium device mockups (iPhone/iPad frames for mobile, macOS/Chrome minimalist frames for web).
2. **Consistent Aspect Ratios:** Maintain standardized aspect ratios for all device frames to prevent layout shifting on Nextra.
3. **High Contrast & Shadows:** Apply a subtle 8px blur shadow (`rgba(0, 0, 0, 0.08)`) and thin border on mockups to lift them beautifully from the light/dark mode backgrounds.
4. **No Emojis in Filenames:** Keep filenames simple, lowercase, and descriptive, using underscores (e.g., `admin_dashboard_3d_map.png`).

---

## 🔗 How to Reference Assets in Documentation

Use standard markdown or relative MDX image tags:

```markdown
![Admin Operations Panel](../assets/mockups/admin_operations_panel.png)
```
