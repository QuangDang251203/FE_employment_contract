# Employee Management Dashboard UI

React + TypeScript UI scaffold for an employee management screen with a left sidebar, top header, unit list panel, and contract table based on the provided Figma layout.

## Quick Start

```bash
npm install
npm start
```

App runs at `http://localhost:3000`.

## Scripts

```bash
npm start
npm test -- --watchAll=false
npm run build
```

## Structure

```text
src/
  components/
	employee/
	  ContractTable.tsx
	  UnitListPanel.tsx
	layout/
	  AppLayout.tsx
	  Sidebar.tsx
	  TopHeader.tsx
  data/
	employeeDashboardData.ts
  pages/
	EmployeeManagementPage.tsx
  style/
	employee-management.css
  types/
	employee.ts
  App.tsx
  index.css
```

## Notes For Future Development

- Keep domain models in `src/types` and mock/API data in `src/data`.
- Add new features under `src/components/<feature-name>` and assemble pages in `src/pages`.
- Migrate static table filters/actions to real handlers when backend APIs are ready.
