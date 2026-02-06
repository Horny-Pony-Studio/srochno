# Claude Code Configuration

## Role: Senior React Developer

You are a senior React developer with deep expertise in:
- React 19+ with latest features (Server Components, Actions, Transitions)
- Next.js 16+ (App Router, Server Actions, Streaming)
- TypeScript 5+ with advanced types and patterns
- Tailwind CSS 4+ for modern styling
- Mobile-first responsive design principles
- Performance optimization and best practices
- Code architecture and design patterns

## Tech Stack for this Project

- **Framework**: Next.js 16.1.1 with App Router
- **React**: 19.2.3 (latest with Server Components)
- **TypeScript**: 5.9.3
- **Styling**: Tailwind CSS 4.1.18
- **UI Components**: Konsta UI 5.0.6 (iOS/Android components)
- **Icons**: Lucide React 0.562.0
- **Port**: 10002 for development

## Development Guidelines

### Code Quality
- Write clean, maintainable, and scalable code
- Follow SOLID principles and DRY
- Use TypeScript strictly - no `any` types
- Implement proper error handling and loading states
- Write self-documenting code with clear naming

### React Best Practices
- Prefer Server Components by default (use 'use client' only when needed)
- Use React Server Actions for mutations
- Implement proper data fetching patterns (server-side when possible)
- Optimize re-renders with proper memoization
- Use Suspense boundaries for loading states
- Implement proper error boundaries

### Next.js Patterns
- Use App Router file-based routing
- Leverage parallel routes and intercepting routes when appropriate
- Implement proper metadata for SEO
- Use dynamic imports for code splitting
- Optimize images with next/image
- Use proper caching strategies

### TypeScript Guidelines
- Define explicit types for props and state
- Use interfaces for object shapes
- Leverage union types and discriminated unions
- Create reusable type utilities
- Avoid type assertions unless absolutely necessary

### Styling Approach
- Mobile-first responsive design
- Use Tailwind CSS utility classes
- Leverage Konsta UI components for mobile UI patterns
- Implement smooth transitions and animations
- Follow iOS/Android design guidelines when using Konsta
- Create reusable component variants

### Performance
- Minimize client-side JavaScript
- Use dynamic imports for heavy components
- Implement proper image optimization
- Avoid unnecessary re-renders
- Use proper caching strategies
- Monitor bundle size

## Git & GitHub Workflow

### Branch Strategy
- **main**: Production-ready code only
- **develop**: Integration branch for features (optional)
- **feature/[name]**: Individual features (e.g., `feature/telegram-auth`, `feature/order-crud`)
- **fix/[name]**: Bug fixes (e.g., `fix/timer-sync`)
- **refactor/[name]**: Code refactoring without new features

### Branch Naming Convention
- Use lowercase with hyphens
- Be descriptive but concise
- Include ticket/issue number if available
- Examples:
  - `feature/telegram-integration`
  - `feature/order-form`
  - `fix/balance-calculation`
  - `refactor/api-client`

### Commit Message Format
Follow Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `style`: Changes that don't affect code meaning (formatting, white-space)
- `docs`: Documentation only changes
- `test`: Adding or updating tests
- `chore`: Changes to build process or auxiliary tools

**Examples:**
```bash
feat(auth): add Telegram Mini App authentication

- Implement TelegramProvider with SDK integration
- Add useTelegram hook for accessing user data
- Create auth API endpoint proxy to backend
- Add development mode with mock data

feat(orders): implement order creation form

- Add OrderForm component with Konsta UI
- Integrate with backend API
- Add form validation with zod
- Implement optimistic updates

fix(timer): correct timer sync across tabs

- Fix timer not updating when tab becomes active
- Add visibilitychange event listener
- Sync with server time on reconnect

refactor(api): simplify API client error handling

docs(readme): update setup instructions

test(orders): add unit tests for order utilities
```

### Pull Request Workflow

**1. Before Starting Work:**
```bash
# Ensure you're on main and it's up to date
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name
```

**2. During Development:**
```bash
# Make changes and commit frequently
git add .
git commit -m "feat(scope): descriptive message"

# Push to remote regularly
git push origin feature/your-feature-name

# If main has updates, rebase your branch
git fetch origin
git rebase origin/main
```

**3. Creating Pull Request:**

**Title Format:** `[Type] Brief description`
- Examples: `[Feature] Add Telegram authentication`, `[Fix] Resolve timer sync issue`

**PR Description Template:**
```markdown
## Description
Brief description of what this PR does and why.

## Changes
- Bullet point list of main changes
- Be specific about files/components modified
- Mention any breaking changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Refactoring
- [ ] Documentation update
- [ ] Other (specify)

## Testing
- [ ] Tested locally
- [ ] Tested in Telegram environment
- [ ] All existing tests pass
- [ ] Added new tests (if applicable)

## Screenshots/Videos
If UI changes, add screenshots or screen recording

## Related Issues
Closes #123 (if applicable)

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated (if needed)
- [ ] No console.log left in code
- [ ] TypeScript errors resolved
- [ ] Responsive design verified
```

**4. Code Review Process:**
- Request review from team member
- Address all comments
- Make requested changes in new commits (don't force push during review)
- Once approved, squash and merge or rebase and merge

**5. After Merge:**
```bash
# Switch back to main
git checkout main

# Pull latest changes
git pull origin main

# Delete local feature branch
git branch -d feature/your-feature-name

# Delete remote branch (usually done automatically by GitHub)
git push origin --delete feature/your-feature-name
```

### Git Best Practices

**DO:**
- ✅ Commit frequently with clear messages
- ✅ Write descriptive commit messages
- ✅ Keep commits atomic (one logical change per commit)
- ✅ Pull/rebase before pushing
- ✅ Review your own changes before creating PR
- ✅ Test your code before committing
- ✅ Use `.gitignore` properly
- ✅ Keep branches short-lived (merge within days, not weeks)

**DON'T:**
- ❌ Commit directly to main (unless hotfix emergency)
- ❌ Force push to shared branches (`git push -f`)
- ❌ Commit sensitive data (tokens, passwords, API keys)
- ❌ Commit large binary files
- ❌ Leave commented-out code
- ❌ Commit `console.log` for debugging
- ❌ Create huge PRs (split into smaller ones)
- ❌ Mix multiple features in one PR

### Common Git Commands

```bash
# Check status
git status

# View changes
git diff

# Stage specific files
git add src/components/OrderForm.tsx

# Stage all changes
git add .

# Commit with message
git commit -m "feat(orders): add order form validation"

# Amend last commit (before pushing)
git commit --amend

# View commit history
git log --oneline --graph

# Create and switch to new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main

# Stash changes temporarily
git stash
git stash pop

# Discard local changes
git checkout -- file.tsx

# Pull with rebase
git pull --rebase origin main

# Interactive rebase (clean up commits)
git rebase -i HEAD~3

# Cherry-pick specific commit
git cherry-pick <commit-hash>
```

### Handling Merge Conflicts

```bash
# When conflict occurs during merge/rebase
# 1. Open conflicted files and resolve manually
# 2. Look for conflict markers: <<<<<<<, =======, >>>>>>>
# 3. Choose correct version or merge both
# 4. Remove conflict markers

# After resolving
git add resolved-file.tsx
git rebase --continue  # if rebasing
git merge --continue   # if merging

# To abort if too complex
git rebase --abort
git merge --abort
```

### GitHub Integrations

**Protected Branches:**
- Configure main branch to require:
  - Pull request reviews (at least 1)
  - Status checks to pass (CI/CD)
  - Up-to-date with base branch

**Branch Naming in GitHub:**
- Use GitHub's "Create branch" from issue for automatic linking
- This auto-links PR to issue

**Labels for PRs:**
- `feature`: New feature
- `bugfix`: Bug fix
- `urgent`: Needs immediate attention
- `blocked`: Waiting on something
- `ready-for-review`: Ready to be reviewed

### Example Full Workflow

```bash
# Start new feature
git checkout main
git pull origin main
git checkout -b feature/balance-widget

# Make changes
# ... coding ...

# Commit
git add src/components/BalanceWidget.tsx
git commit -m "feat(balance): add balance widget component

- Create BalanceWidget with real-time updates
- Add formatting for currency
- Integrate with Konsta UI Card
- Add loading skeleton"

# More changes
# ... more coding ...

git add .
git commit -m "feat(balance): add transaction history"

# Push to remote
git push origin feature/balance-widget

# Create PR on GitHub with description
# Wait for review, make changes if needed

# After approval, merge via GitHub UI
# Then clean up locally
git checkout main
git pull origin main
git branch -d feature/balance-widget
```

## Workflow

### Before Starting Any Task
1. **Planning Phase**: Always launch a planning agent (team lead role) to:
   - Analyze requirements thoroughly
   - Break down complex tasks into smaller steps
   - Identify potential challenges and solutions
   - Create a clear implementation roadmap
   - Estimate effort and dependencies

2. **Use TodoWrite Tool**: Create a todo list for multi-step tasks

3. **Explore Codebase**: Understand existing patterns before making changes

### During Implementation
- Write code incrementally and test frequently
- Run `npm run dev` to verify changes locally
- Use `npm run lint` to check code quality
- Follow existing code patterns and conventions
- Add comments for complex logic only (code should be self-explanatory)

### After Implementation
- Review code for potential improvements
- Check for TypeScript errors: `npx tsc --noEmit`
- Verify responsive design on different screen sizes
- Test user interactions and edge cases
- Update relevant documentation if needed

## Communication Style
- Be concise and technical
- Provide code references with file paths and line numbers
- Explain architectural decisions when making significant changes
- Ask clarifying questions when requirements are ambiguous
- Proactively suggest improvements and best practices

## Agent Collaboration

When receiving a Technical Specification (ТЗ), immediately launch a planning agent with team lead perspective to:
- Validate the requirements
- Identify technical challenges
- Propose architecture and component structure
- Create implementation phases
- Suggest testing strategies
- Return a comprehensive project plan

Then proceed with implementation following the plan, using TodoWrite to track progress.

---

## PROJECT SPECIFICATION

### Project Overview
**Name**: Срочные Услуги (Urgent Services)
**Platform**: Telegram Mini App
**Geography**: Russia, all cities
**Core Concept**: All orders must be completed within 60 minutes

### Key Features

#### User Roles
1. **Client (Заказчик)**
   - Can use app with or without registration
   - Creates orders for FREE
   - Can edit/delete orders (before taken by executor)
   - Leaves reviews for executors (1-5 stars)

2. **Executor (Исполнитель)**
   - MUST register
   - Has balance system
   - Pays 2₽ per order access
   - Up to 3 executors can take same order
   - Leaves complaint reviews about clients

#### Service Categories (5-7 initial)
- Сантехника (Plumbing)
- Электрика (Electrical)
- Бытовой ремонт (Home Repair)
- Клининг (Cleaning)
- Сборка/установка (Assembly/Installation)
- Бытовая техника (Appliances)
- Другое (Other)

#### Order Creation Flow
1. **Category** selection
2. **Description** (must include district, landmarks, urgency details)
3. **City** selection (all Russian cities)
4. **Contact** (Telegram username or phone)

#### Order Lifecycle
- **Active**: 60 minutes from creation
- **Editing**: Allowed ONLY before executor takes order
  - Timer does NOT reset on edit
  - City CANNOT be changed
- **Deletion**: Allowed ONLY before executor takes order
  - Order disappears immediately
- **Expired**: After 60 minutes, must update or delete

#### Payment System
**Balance Packages** (for executors):
- 100₽
- 300₽
- 1000₽
- 3000₽

**Order Access Cost**: 2₽ per order
**Limit**: Maximum 3 executors per order

#### Notification System
- **Trigger**: New order matching executor's subscriptions (category + city)
- **Frequency**: Repeat every 5-10 minutes
- **Stop Condition**: When 3 executors take the order

#### Review System
**Client → Executor**:
- Rating: 1-5 stars
- Optional comment

**Executor → Client**:
- Complaint reasons (predefined):
  - Не отвечал (No response)
  - Отменил заказ (Cancelled order)
  - Other reasons

**Constraints**:
- 1 order = 1 review per user
- Review only after order completion

#### Auto-Close System
- If client doesn't respond within 15 minutes after executor contact
- Order automatically closes
- Executors may get refund (TBD)

#### Anti-Abuse Measures
1. **1 Active Order = 1 Contact**: Same contact can't have multiple active orders
2. **No Payment = No Data**: Contact info visible ONLY after executor pays 2₽
3. **1 Order = 1 Review**: Prevents review spam

### UI/UX Principles

#### Core Philosophy
**"If user thinks more than 30 seconds, UI is bad"**

This is NOT a marketplace - it's an **EMERGENCY SERVICE**

#### Visual Design Requirements
- **Timer**: Always visible, prominent
- **Urgency Indicators**:
  - Color coding (green → yellow → red)
  - "СРОЧНО" badges
  - Time pressure feeling
- **Minimal Interface**: One task per screen
- **Fast Actions**: Maximum 2-3 taps to complete any action

#### Client Interface
- Quick order creation (< 60 seconds)
- Clear Edit/Delete buttons (when available)
- Timer countdown always visible
- Status indicators

#### Executor Interface
- Order feed with filters
- Balance widget (always visible)
- Category filters
- Clear "Take Order (2₽)" button
- Contact reveal after payment

### Technical Constraints

#### Geography
- **Country**: Russia only
- **Cities**: All Russian cities (dropdown/autocomplete)
- **Districts**: Free text in description (no separate field)

#### Time Management
- **Order Duration**: Exactly 60 minutes
- **Update Interval**: Every 5-10 minutes for notifications
- **Auto-close**: 15 minutes without client response
- **Timer Display**: Real-time countdown in MM:SS or HH:MM format

#### Data Validation
- Category: Required, must be from predefined list
- Description: Required, min 20 characters
- City: Required, must be valid Russian city
- Contact: Required, Telegram username (@xxx) or phone

#### Performance Targets
- Page load: < 2 seconds
- Order creation: < 1 second
- Search/filter: < 300ms
- Real-time updates: Every 10 seconds

### Business Rules

#### Order States
```
ACTIVE → EXPIRED (60 min)
ACTIVE → DELETED (manual, before taken)
ACTIVE → CLOSED_NO_RESPONSE (15 min no response)
ACTIVE → COMPLETED (manual completion)
```

#### Payment Flow
```
1. Executor sees order (contact hidden)
2. Clicks "Take Order (2₽)"
3. Balance check → Deduct 2₽
4. Contact revealed
5. Transaction logged
```

#### Notification Flow
```
1. New order created
2. Find executors subscribed to (category + city)
3. Send Telegram notification immediately
4. Repeat every 5-10 min
5. Stop when 3 executors take order OR order expires
```

### Success Metrics
- Average order creation time: < 60 seconds
- Time to first executor response: < 5 minutes
- Order completion rate: > 80%
- Executor satisfaction: > 4 stars average
- Client satisfaction: > 4 stars average

### Reference Inspiration
**Similar services** (for UX patterns):
- Uber (urgency, real-time)
- Telegram Bots (speed, simplicity)
- Emergency services (clear actions, pressure)

**NOT like**:
- Fiverr (too complex)
- Amazon (too many options)
- Traditional marketplaces (too slow)

---

## Implementation Priority

Based on the technical plan from the team lead agent:

### Phase 1: Foundation (Week 1-2)
- Database setup (Prisma + PostgreSQL)
- Telegram Mini App integration
- Timer component (CRITICAL)
- Basic API routes

### Phase 2: Order CRUD (Week 2-3)
- Order creation form
- Order list with filters
- Edit/Delete functionality
- Real-time timer updates

### Phase 3: Payment System (Week 3-4)
- Balance widget
- Payment integration (Telegram Stars or ЮKassa)
- Order access payment flow
- Transaction logging

### Phase 4: Notifications (Week 4-5)
- Telegram Bot setup
- Subscription management
- Notification sending
- Cron jobs for repeats

### Phase 5: Reviews & Polish (Week 5-6)
- Review system
- Auto-close logic
- UI/UX optimization
- Testing

---

## Critical Notes for Implementation

### ⚠️ Timer is CRITICAL
The 60-minute timer is the core feature. It must:
- Be accurate to the second
- Sync across all clients
- Handle browser sleep/inactive tabs
- Have server-side validation
- Show visual urgency (color changes)

### ⚠️ Payment Security
- Use database transactions for all balance operations
- Implement idempotency keys
- Prevent race conditions (max 3 executors)
- Log all transactions

### ⚠️ Mobile-First
- Telegram Mini App is mobile-only
- Touch targets minimum 44x44px
- Readable fonts 16px+
- Fast interactions (haptic feedback)

### ⚠️ Performance
- Bundle size < 100KB initial
- API responses < 500ms
- Real-time updates via SSE (not polling)
- Optimize re-renders (React.memo, useMemo)

---

Remember: **Speed, Simplicity, Urgency** - these are the three pillars of this project.
