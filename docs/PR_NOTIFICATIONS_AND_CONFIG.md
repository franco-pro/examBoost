# PR: Notifications feature + Metro/Hermes stability + UI typing fixes (tva) + UX improvements

## Résumé
- Ajout d’une feature Notifications complète: liste, swipe actions, bottom sheet de détails, toasts, suppression individuelle et globale, marquage lu/non-lu.
- Stabilisation bundling Metro/Hermes: config Babel conforme SDK 53 et imports natifs au bon endroit.
- Correctifs TypeScript sur les variantes `tva` (casts) dans les composants UI partagés.
- Améliorations UX: gestion du texte long, feedback visuel au clic, différenciation claire lu/non-lu, et icônes pour les actions secondaires.

---

## Changements par fichier

### Configuration / Structure
- `babel.config.js`
  - Plugins: suppression de `react-native-worklets/plugin`; maintien de `'react-native-reanimated/plugin'` en DERNIER.
  - Raison: éviter « Duplicate plugin/preset » sous SDK 53; Reanimated gère déjà les Worklets.
  - Impact équipe: standard Expo; aucune action si les versions sont alignées.

- `app/_layout.tsx`
  - Ajout en tout premier: `import 'react-native-gesture-handler';` et `import 'react-native-reanimated';`
  - Ajout de `QueryClientProvider` (React Query) et `GestureHandlerRootView`.
  - Raison: initialisation correcte des TurboModules (Hermes) et mise en place des providers globaux.

- `app/styles/style.ts`
  - Ajout d’un `default export` placeholder (retourne `null`) pour supprimer l’alerte expo-router « missing default export ».
  - À faire après merge: déplacer ce fichier vers `src/styles/style.ts` (ce n’est pas une route).

### Feature Notifications
- `src/features/notifications/api.mock.ts` (nouveau)
  - Mock API: `listNotifications`, `deleteNotification`, `clearNotifications`, `markRead` + `store` local.

- `src/features/notifications/hooks.ts` (nouveau)
  - Hooks React Query:
    - `useNotifications`, `useDeleteNotification`, `useClearNotifications`, `useMarkRead`.
  - Mises à jour optimistes:
    - `useMarkRead`: met à jour `read` localement, rollback si erreur, invalidation ensuite.
    - `useDeleteNotification`: supprime dans le cache immédiatement, rollback si erreur, invalidation ensuite.
    - `useClearNotifications`: vide la liste immédiatement, rollback si erreur, invalidation ensuite.

- `src/features/notifications/NotificationItem.tsx` (nouveau)
  - Long texte: clamp à 3 lignes + bouton « Voir plus / Voir moins ».
  - Press feedback: opacité + légère mise à l’échelle.
  - Différenciation visuelle:
    - Non lu: fond légèrement teinté + barre d’accent à gauche + titre plus dense.
    - Lu: fond normal + titre atténué.
  - Actions secondaires (icônes seulement):
    - « Marquer non lu » (affiché uniquement si l’item est lu).
    - « Supprimer ».

- `src/features/notifications/NotificationSwipeableItem.tsx` (nouveau)
  - Swipe gauche: « Marquer lu/non lu ».
  - Swipe droit: « Supprimer ».
  - Haptics + fermeture automatique du swipe après action.

- `app/(tabs)/notifications.tsx`
  - `FlatList<Notification>` + `keyExtractor` stable.
  - `onPress` de l’item: marque « lu » automatiquement puis ouvre le détail (bottom sheet).
  - Bottom sheet: actions icône-only (marquer non lu si lu, supprimer). Bouton « Ouvrir » conservé.
  - Header: « Tout supprimer » inchangé (texte + icône).
  - Mise à jour du badge de l’onglet en fonction des non-lus.

### Composants UI partagés (typing-only; pas d’impact runtime)
- `components/ui/accordion/index.tsx`
  - `AccordionIcon`: cast `size` et `parentVariants.size` vers l’union littérale `'2xs'|'xs'|'sm'|'md'|'lg'|'xl'|undefined`.

- `components/ui/actionsheet/index.tsx`
  - `ActionsheetItemText`: cast `size` `'2xs'... '6xl'`.
  - `ActionsheetIcon`: cast `size` `'2xs'... 'xl'|undefined`.
  - `ActionsheetSectionHeaderText`: cast `size` `'xs'... '5xl'|undefined`.

- `components/ui/alert-dialog/index.tsx`
  - `AlertDialogContent`: cast `size` et `parentVariants.size` `'xs'|'sm'|'md'|'lg'|'full'|undefined`.

- `components/ui/avatar/index.tsx`
  - `AvatarBadge`, `AvatarFallbackText`: cast `size` (et `parentVariants.size`) `'xs'|'sm'|'md'|'lg'|'xl'|'2xl'|undefined`.

- `components/ui/badge/index.tsx`
  - `BadgeText`, `BadgeIcon`: cast `size` `'sm'|'md'|'lg'|undefined` et `action` `'error'|'warning'|'success'|'info'|'muted'|undefined`.

- `components/ui/bottomsheet/index.tsx`
  - Contexte: `bottomSheetRef: React.RefObject<GorhomBottomSheet | null>` et `useRef<GorhomBottomSheet | null>(null)` pour éviter les erreurs TS sur `null`.

---

## Impacts potentiels pour l’équipe (prioritaire)

- Babel / Metro / Hermes
  - `babel.config.js`: Reanimated plugin unique et listé en dernier. Suppression du plugin `react-native-worklets` autonome.
  - Risque: si quelqu’un dépendait explicitement du plugin worklets externe (hors Reanimated). Justification: SDK 53 — Reanimated couvre déjà les worklets.

- Layout global / Providers
  - `app/_layout.tsx`: imports natifs en tête + `QueryClientProvider` + `GestureHandlerRootView`.
  - Documenter l’ordre des providers et éviter les doublons ailleurs.

- Composants UI partagés
  - Modifs typing-only pour `tva` (casts). Aucun rendu modifié.
  - Noter la convention: caster les variants aux unions littérales pour éviter le bruit TS.

- Faux écran `app/styles/style.ts`
  - Placeholder ajouté uniquement pour supprimer le warning. Ce fichier doit être déplacé hors de `app/` après le merge.

- UX Notifications
  - Changement: marquage « lu » automatique au tap (au lieu d’un bouton « Marquer lu »). Toujours possible de « Marquer non lu » via icône.
  - Confirmer avec l’équipe produit si ce comportement est la règle désirée.

---

## Instructions post-merge (toutes machines)

- Aligner les versions Expo SDK 53 (via `npx`):
```
npx expo install expo@~53.0.23
npx expo install expo-router@~5.1.7
npx expo install react-native@0.79.5
npx expo install react-native-reanimated@~3.17.4
npx expo install react-native-safe-area-context@5.4.0
npx expo install react-native-svg@15.11.2
```

- Nettoyer les caches et redémarrer Metro:
```
npx rimraf .expo .expo-shared node_modules\.cache
npx expo start -c
```

- Déplacer le style hors de `app/`:
  - `app/styles/style.ts` → `src/styles/style.ts` et supprimer le placeholder.

---

## Plan de test

- Démarrage Android + Web
  - Aucun « Duplicate plugin/preset ».
  - Pas d’erreur Hermes « installTurboModule ».
  - Pas de warning expo-router « missing default export » (après déplacement du style).

- Notifications
  - Tap sur une notification non lue → feedback visuel + passage à « lu » immédiat (optimiste) + ouverture des détails.
  - Bouton icône « Marquer non lu » visible uniquement si l’item est lu (item + bottom sheet).
  - Bouton icône « Supprimer » → suppression immédiate (optimiste).
  - « Tout supprimer » → vidage immédiat de la liste (optimiste).
  - Badge d’onglet mis à jour selon nombre de non-lus.

- Composants UI
  - Pas de régression visuelle ni d’erreurs TS sur `components/ui/*`.

---

## Rollback plan
- Revenir au `babel.config.js` précédent si besoin.
- Retirer les `onMutate/onError/onSettled` dans les hooks pour désactiver l’optimistic UI.
- Dans `app/(tabs)/notifications.tsx`, remettre `onPress` à `openDetails(item)` si l’auto-lu n’est pas souhaité.
- Supprimer le placeholder de `app/styles/style.ts` et déplacer le fichier vers `src/`.

---

## Notes de documentation
- Providers & Init: décrire dans un README/CONTRIBUTING l’ordre et la raison d’être des imports/provid ers dans `app/_layout.tsx`.
- Router: ne pas déposer de fichiers non-pages sous `app/`.
- Variants `tva`: caster vers les unions littérales requises.
