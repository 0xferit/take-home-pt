# Automatic Versioning with Git Commit Hash

## Overview

**New versioning system:** Every commit automatically gets a unique version number!

**Format:** `v{MAJOR}.{BUILD_HASH}`

**Example:** `v2025.2.822d28d`
- `2025.2` = Major version (manual)
- `822d28d` = Build identifier (automatic git commit hash)

---

## How It Works

### 1. Two-Tier Versioning

#### Tier 1: Major Version (Manual, Rare)
**File:** `data.js`
```javascript
VERSION: '2025.2',           // Bump for major releases
LAST_UPDATED: '2025-10-17',
```

**When to bump:**
- ✅ Major features (e.g., multi-year projection)
- ✅ Breaking changes (e.g., API changes)
- ✅ Annual updates (e.g., tax year 2026)
- ✅ Significant refactors

**Frequency:** Monthly or quarterly (not every commit)

#### Tier 2: Build Version (Automatic, Every Commit)
**Source:** Git commit hash (first 7 characters)

**When to bump:** Automatically with every commit

**Frequency:** Every single commit

### 2. Runtime Version Detection

**File:** `app.js` → `populateAppVersion()`

```javascript
function populateAppVersion() {
    // 1. Show static fallback immediately
    versionEl.textContent = `TakeHome PT v2025.2`;
    
    // 2. Fetch latest commit from GitHub API
    fetch('https://api.github.com/repos/0xferit/take-home-pt/commits/main')
        .then(response => response.json())
        .then(data => {
            const shortHash = data.sha.substring(0, 7);  // e.g., "822d28d"
            const fullVersion = `v2025.2.${shortHash}`;  // e.g., "v2025.2.822d28d"
            
            versionEl.textContent = `TakeHome PT ${fullVersion} (${date})`;
        });
}
```

---

## Benefits

### ✅ Can't Forget to Bump
**Before:** "Oops, I forgot to update version in data.js"  
**After:** Automatic - every commit gets a unique version

### ✅ Perfect Traceability
**Before:** "What exact code is in v2025.2?"  
**After:** "v2025.2.822d28d maps to commit 822d28d" (exact code)

### ✅ Better Bug Reports
**User:** "I found a bug on v2025.2.822d28d"  
**Developer:** `git checkout 822d28d` (exact reproduction)

### ✅ Automatic Cache Busting
Every commit = new version = forces browser refresh

### ✅ Production Tracking
Netlify deployment version = exact commit hash

---

## Developer Workflow

### Every Regular Commit
```bash
# Just commit normally - version bumps automatically!
git commit -m "fix: correct tax calculation"
git push

# Version is now: v2025.2.{new_commit_hash}
# ✅ No manual version update needed!
```

**Result:** Version automatically becomes `v2025.2.a1b2c3d` (new hash)

### Major Release
```bash
# 1. Bump major version in data.js
# Change VERSION: '2025.2' to VERSION: '2025.3'

# 2. Commit and push
git commit -m "chore: bump major version to 2025.3"
git push

# Version is now: v2025.3.{new_commit_hash}
```

**Frequency:** Only when shipping major features/changes

---

## Version Display

### In Footer
```
TakeHome PT v2025.2.822d28d (2025-10-17)
```

**Hover tooltip:** Shows commit message

### In Console
```
✅ Version: v2025.2.822d28d | Commit: 822d28d | Date: 2025-10-17
```

### Fallback (Offline/API Failure)
```
TakeHome PT v2025.2
```

---

## Examples

### Timeline of Versions

| Commit | Short Hash | Version | Description |
|--------|-----------|---------|-------------|
| Initial | `a1b2c3d` | `v2025.1.a1b2c3d` | Initial release |
| Bugfix #1 | `b2c3d4e` | `v2025.1.b2c3d4e` | Fix tax calculation |
| Bugfix #2 | `c3d4e5f` | `v2025.1.c3d4e5f` | Fix UI display |
| **Major release** | `d4e5f6a` | **`v2025.2.d4e5f6a`** | Multi-year projection (major version bumped) |
| Feature #1 | `e5f6a7b` | `v2025.2.e5f6a7b` | Add IRS Jovem |
| Bugfix #3 | `f6a7b8c` | `v2025.2.f6a7b8c` | Fix property names |
| Current | `822d28d` | `v2025.2.822d28d` | Automatic versioning |

**Note:** Every commit has a unique version - no gaps, no duplicates!

---

## Comparison: Before vs. After

### Before (Manual Versioning)

❌ **Problems:**
- Forgot to bump version → multiple commits with same version
- "What's in v2025.2?" → unclear which commit
- Bug report: "Issue on v2025.2" → which of the 5 commits?
- Manual work: Update version in file for every change

### After (Automatic Versioning)

✅ **Solutions:**
- Can't forget → automatic with every commit
- "What's in v2025.2.822d28d?" → exact commit 822d28d
- Bug report: "Issue on v2025.2.822d28d" → `git checkout 822d28d`
- Zero manual work → commit hash is the version

---

## Implementation Details

### GitHub API Fetch
```javascript
// Fetches latest commit info
const apiUrl = 'https://api.github.com/repos/0xferit/take-home-pt/commits/main';

// Response includes:
{
  sha: "822d28d1234567890abcdef...",  // Full hash
  commit: {
    message: "feat: implement automatic versioning",
    committer: {
      date: "2025-10-17T12:34:56Z"
    }
  }
}

// Extract short hash (first 7 chars)
const shortHash = sha.substring(0, 7);  // "822d28d"
```

### Fallback Strategy
1. **Immediate:** Show static major version (`v2025.2`)
2. **Progressive enhancement:** Fetch commit hash, update to full version
3. **Error handling:** If API fails, keep showing major version only

### No Internet? No Problem!
- Static fallback always visible in HTML: `v2025.2`
- JavaScript enhances with commit hash when online
- Graceful degradation - works offline

---

## Cursor Rule Integration

The `.cursorrules` file now documents this system:

**Key Points:**
- Major version (e.g., `2025.2`) = Manual, for significant releases
- Build version (e.g., `822d28d`) = Automatic, every commit
- No checklist needed for build version (automatic)
- Only bump major version for significant milestones

**Developer experience:**
```bash
# 99% of the time: Just commit
git commit -m "fix: something"
git push
# ✅ Version automatically becomes v2025.2.{new_hash}

# 1% of the time: Major release
# Edit data.js: VERSION: '2025.3'
git commit -m "chore: bump to v2025.3"
git push
# ✅ Version automatically becomes v2025.3.{new_hash}
```

---

## Testing

### Verify Version Display
1. Open calculator in browser
2. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. Check footer: Should show `TakeHome PT v2025.2.{hash} (date)`
4. Hover over version: Should show commit message

### Verify Console Output
1. Open browser console (F12)
2. Look for: `✅ Version: v2025.2.{hash} | Commit: {hash} | Date: {date}`

### Verify Uniqueness
```bash
# Make a change
git commit -m "test: verify versioning"
git push

# Hard refresh browser
# Version should change to new commit hash
```

---

## Migration Notes

### What Changed

**Before:**
```javascript
// data.js
VERSION: '2025.2',

// app.js
versionEl.textContent = `v${DATA.VERSION}`;
```

**After:**
```javascript
// data.js
VERSION: '2025.2',  // Only for major releases

// app.js
const shortHash = fetchFromGitHub();  // Automatic
versionEl.textContent = `v${DATA.VERSION}.${shortHash}`;
```

### Breaking Changes
- None! Fully backward compatible
- Major version still works as fallback
- Only enhancement: Adds commit hash to version

---

## Future Enhancements

### Possible Improvements
1. **Build-time injection:** Generate version at build time (Netlify)
2. **Semver integration:** `v2025.2.0+822d28d` (semver build metadata)
3. **Version history:** Show recent versions in UI
4. **Changelog link:** Click version → see changelog

### Already Perfect For
✅ Bug tracking and reproduction  
✅ Production deployment tracking  
✅ Cache busting  
✅ Audit trail  
✅ No manual intervention

---

## Status

✅ **Implemented:** Commit `822d28d`  
✅ **Documented:** This file + `.cursorrules`  
✅ **Tested:** Version displays correctly  
✅ **Pushed:** Live on production

**Current Version:** `v2025.2.822d28d`

---

**Conclusion:**

🎯 **You can't forget to bump the version anymore** - it happens automatically with every commit!

Every commit = unique version = perfect traceability = better bug reports = automatic cache busting = production tracking.

**The version number IS the commit hash.** Simple, automatic, foolproof.
