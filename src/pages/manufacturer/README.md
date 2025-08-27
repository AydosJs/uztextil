# Buyurtmachi (Customer) Flow

This folder contains the customer-facing components and pages for the textile ordering system.

## Folder Structure

```
Buyurtmachi/
├── components/          # Reusable components specific to Buyurtmachi flow
├── pages/              # Page components for different steps in the flow
├── BuyurtmachiWelcome.tsx  # Welcome page for customers
└── index.ts            # Exports for the folder
```

## Components

- **BuyurtmachiWelcome**: The main welcome page that customers see after selecting "Buyurtmachi" in the department selection

## Navigation Flow

1. User selects "Buyurtmachi" (Customer) in ChooseDepartment page
2. User is navigated to `/buyurtmachi/welcome`
3. User sees the BuyurtmachiWelcome page with 3-step process overview
4. User clicks "Get Started" to proceed to next step (to be implemented)

## Future Steps

The following pages will be added to the `pages/` subfolder:
- Product selection page
- Quote request page
- Order placement page
- Order tracking page

## Naming Convention

All components and files use English names as requested:
- `BuyurtmachiWelcome` instead of localized names
- Clear, descriptive component names
- Consistent file naming patterns
