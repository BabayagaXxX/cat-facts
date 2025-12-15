# Database Migration Instructions

## Update Adoptions Table - Remove Pending Status

### What Changed:
- Removed "pending" status from the system
- Now only using: **available** and **adopted**
- When users click "I Want to Adopt", the status changes directly to **adopted**

### Steps to Apply Migration:

1. **Open PowerShell in the project directory**

2. **Run the migration script:**
   ```powershell
   node scripts/update-adoptions-remove-pending.js
   ```

3. **You should see:**
   ```
   🔄 Starting migration: Remove pending status from adoptions...
   ✅ Connected to database
   📝 Executing migration...
   ✅ Migration completed successfully!
   📊 Current adoption status distribution:
      available: X
      adopted: Y
   ✨ All done! The adoptions table now only uses "available" and "adopted" statuses.
   ```

### What the Migration Does:

1. **Updates existing data**
   - Any adoptions with status "pending" are changed to "available"

2. **Updates the database schema**
   - Changes the ENUM type to only allow: `'available'`, `'adopted'`
   - Default status remains: `'available'`

### After Migration:

Your app will now work with only 2 statuses:
- 🟢 **Available** - Cat is ready for adoption
- 🔵 **Adopted** - Cat has been adopted

### Testing:

1. Start your app: `npm run dev`
2. Go to adoptions page
3. Click on an available cat
4. Click "I Want to Adopt [Cat Name]"
5. Status should change to "adopted" immediately
6. Card should show blue "adopted" badge

### Rollback (if needed):

If you need to restore the "pending" status, run:
```sql
ALTER TABLE adoptions 
MODIFY COLUMN adoption_status ENUM('available', 'pending', 'adopted') NOT NULL DEFAULT 'available';
```

---

**Ready to apply?** Run: `node scripts/update-adoptions-remove-pending.js`
