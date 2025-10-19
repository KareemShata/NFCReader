# TypeScript Guide for React Native Expo App

## 🎯 What Changed

Your entire React Native Expo app has been converted from JavaScript to TypeScript. Here's what was converted:

### Files Converted:
- ✅ `App.js` → `App.tsx`
- ✅ `screens/HomeScreen.js` → `screens/HomeScreen.tsx`
- ✅ `screens/NFCReaderScreen.js` → `screens/NFCReaderScreen.tsx`

### New Files Created:
- ✅ `tsconfig.json` - TypeScript configuration
- ✅ `app.d.ts` - Global type declarations

### Dependencies Added:
- `typescript` - The TypeScript compiler
- `@types/react` - Type definitions for React
- `@types/react-native` - Type definitions for React Native

---

## 🔍 Key TypeScript Features Added

### 1. **Type-Safe Navigation**

```typescript
export type RootStackParamList = {
  Home: undefined;
  NFCReader: undefined;
};
```

This ensures you can only navigate to screens that exist and with the correct parameters.

### 2. **Interface Definitions**

```typescript
interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

interface CardData {
  id: string;
  techTypes: string[];
  type: string;
  cardNumber: string;
  scannedAt: string;
}
```

Interfaces define the shape of objects, providing autocomplete and error checking.

### 3. **Typed useState Hooks**

```typescript
const [isScanning, setIsScanning] = useState<boolean>(false);
const [cardData, setCardData] = useState<CardData | null>(null);
const [error, setError] = useState<string | null>(null);
```

This prevents you from accidentally setting the wrong type of value to state.

### 4. **Function Return Types**

```typescript
const checkNfcSupport = async (): Promise<void> => {
  // function body
};

const parseCardData = (tag: TagEvent): CardData => {
  // function body
};
```

Explicitly declaring return types catches errors early.

### 5. **React.FC Type for Components**

```typescript
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  // component body
};
```

This provides type checking for component props.

---

## 💡 Benefits of TypeScript

### 1. **Catch Errors Early**
TypeScript catches type errors at compile time, before your app runs:
```typescript
// ❌ This will error at compile time:
setIsScanning("true"); // Type 'string' is not assignable to type 'boolean'

// ✅ This is correct:
setIsScanning(true);
```

### 2. **Better IDE Support**
- Autocomplete for object properties
- Inline documentation
- Refactoring tools
- Jump to definition

### 3. **Self-Documenting Code**
Types serve as documentation:
```typescript
// You can see exactly what properties cardData has
interface CardData {
  id: string;
  techTypes: string[];
  type: string;
  cardNumber: string;
  scannedAt: string;
}
```

### 4. **Safer Refactoring**
When you change a type, TypeScript shows you everywhere that needs updating.

---

## 🚀 How to Use TypeScript in Your Development

### Type Checking
Run type checking without building:
```bash
npx tsc --noEmit
```

### Common TypeScript Patterns

#### Optional Properties
```typescript
interface User {
  name: string;
  email?: string;  // Optional
}
```

#### Union Types
```typescript
type Status = 'idle' | 'loading' | 'success' | 'error';
const [status, setStatus] = useState<Status>('idle');
```

#### Generics
```typescript
const [items, setItems] = useState<string[]>([]);
const [user, setUser] = useState<User | null>(null);
```

#### Type Guards
```typescript
if (error instanceof Error) {
  console.log(error.message);
}
```

---

## 📚 Learning Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [TypeScript with React Native](https://reactnative.dev/docs/typescript)

---

## 🔧 Troubleshooting

### "Cannot find module" errors
Install type definitions:
```bash
npm install --save-dev @types/[package-name]
```

### Type errors in third-party libraries
Add to `app.d.ts`:
```typescript
declare module 'library-name' {
  const content: any;
  export default content;
}
```

### Strict mode errors
You can temporarily disable strict mode in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "strict": false
  }
}
```

---

## ✅ Next Steps

1. Run your app: `npm start` or `npx expo start`
2. Try the type checking: `npx tsc --noEmit`
3. Explore autocomplete in your IDE
4. Add types to any new code you write

Your app now has full TypeScript support with all the benefits of type safety! 🎉

