-- ============================================
-- FIX RLS POLICIES FOR CHURCH ADMIN PANEL
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can view households" ON public.households;
DROP POLICY IF EXISTS "Admins can manage households" ON public.households;
DROP POLICY IF EXISTS "Members can view own profile" ON public.members;
DROP POLICY IF EXISTS "Leaders can view ministry members" ON public.members;
DROP POLICY IF EXISTS "Admins can manage all members" ON public.members;
DROP POLICY IF EXISTS "Authenticated can view ministries" ON public.ministries;
DROP POLICY IF EXISTS "Members can view own ministry roles" ON public.member_ministries;
DROP POLICY IF EXISTS "Members can view own milestones" ON public.spiritual_milestones;
DROP POLICY IF EXISTS "Authors can manage own notes" ON public.pastoral_notes;
DROP POLICY IF EXISTS "Pastors can view confidential notes" ON public.pastoral_notes;
DROP POLICY IF EXISTS "Authenticated can view active events" ON public.events;

-- ============================================
-- NEW POLICIES: Allow all authenticated users (church staff) full access
-- Adjust based on your role requirements
-- ============================================

-- HOUSEHOLDS: All authenticated users can manage
CREATE POLICY "Staff can manage households"
    ON public.households FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- MEMBERS: All authenticated users can manage (admin panel)
CREATE POLICY "Staff can manage members"
    ON public.members FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- MINISTRIES: All authenticated users can manage
CREATE POLICY "Staff can manage ministries"
    ON public.ministries FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- MEMBER_MINISTRIES: All authenticated users can manage
CREATE POLICY "Staff can manage member_ministries"
    ON public.member_ministries FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- SPIRITUAL_MILESTONES: All authenticated users can manage
CREATE POLICY "Staff can manage spiritual_milestones"
    ON public.spiritual_milestones FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- PASTORAL_NOTES: All authenticated users can manage
CREATE POLICY "Staff can manage pastoral_notes"
    ON public.pastoral_notes FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- EVENTS: All authenticated users can manage
CREATE POLICY "Staff can manage events"
    ON public.events FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ============================================
-- OPTIONAL: Add user_id column to members for future user-specific access
-- ============================================
-- ALTER TABLE public.members ADD COLUMN user_id uuid REFERENCES auth.users(id);
-- CREATE INDEX idx_members_user_id ON public.members(user_id);
-- 
-- -- Then update policy to:
-- -- CREATE POLICY "Users can view own member profile"
-- --     ON public.members FOR SELECT
-- --     TO authenticated
-- --     USING (user_id = auth.uid());
-- -- 
-- -- CREATE POLICY "Staff can manage all members"
-- --     ON public.members FOR ALL
-- --     TO authenticated
-- --     USING (true)
-- --     WITH CHECK (true);