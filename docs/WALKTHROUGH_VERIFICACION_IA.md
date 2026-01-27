# Walkthrough: Verificación de Retos con Gemini AI

## ✅ Estado: Implementado y Funcionando

La app verifica automáticamente si una foto cumple el reto usando **Gemini 2.5 Flash**.

---

## 📁 Archivos Modificados/Creados

### [NEW] `src/services/gemini.service.ts`
Servicio de verificación con Gemini Vision.

```typescript
verifyChallenge(imageUrl, challengeTitle, challengeDescription) 
→ { approved: boolean, confidence: number, reason: string }
```

### [MODIFIED] `src/models/submission.ts`
```typescript
export interface AIVerification {
  confidence: number;    // 0.0 - 1.0
  reason: string;        // Explicación de la IA
  verifiedAt: Date;
}

// Añadido a submission:
aiVerification?: AIVerification;
```

### [MODIFIED] `src/services/cloudinary.service.ts`
- Nuevo parámetro: `challenge?: dailyChallenge`
- Llama a `verifyChallenge()` después del upload
- Guarda resultado en `submission.aiVerification`

### [MODIFIED] `src/screens/home-screen.tsx`
- Pasa `challenge` completo al subir
- Botón "Volver a subir (Test)" (eliminar en producción)

---

## 🔧 Configuración Actual

| Item | Valor |
|------|-------|
| **Modelo** | `gemini-2.5-flash` |
| **SDK** | `@google/generative-ai` |
| **API Key** | Hardcoded en `gemini.service.ts` |

---

## 🚀 TODO: Para Producción

### 1. Variables de Entorno
```bash
# .env
GEMINI_API_KEY=AIzaSy...
GEMINI_MODEL=gemini-2.5-flash
```

### 2. Configuración en Firebase/BD
Mover a Firestore collection `config`:
```json
{
  "ai": {
    "model": "gemini-2.5-flash",
    "prompt": "Eres un juez de retos diarios...",
    "minConfidence": 0.7
  }
}
```

### 3. Eliminar código de testing
- Quitar botón "Volver a subir (Test)" de `home-screen.tsx`

### 4. Migrar a Cloud Functions (Opción B)
- Mover lógica de Gemini a Firebase Cloud Function
- Cambiar llamada directa por `httpsCallable`

---

## 📊 Flujo de Verificación

```
Usuario toma foto
       ↓
Cloudinary upload → mediaUrl
       ↓
gemini.service.ts → fetch(mediaUrl) → base64
       ↓
Gemini API → analiza imagen
       ↓
{ approved, confidence, reason }
       ↓
Firestore → submission con aiVerification
```
