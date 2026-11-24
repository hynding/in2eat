"use client";

import { useState } from "react";
import type { Recipe } from "@in2eat/content-schema";
import { formatQuantity, scaleQuantity } from "../lib/quantity";
import styles from "./RecipeDetail.module.css";

interface IngredientsProps {
  readonly groups: Recipe["ingredients"];
  readonly servings: number;
}

/** Ingredient list with a servings stepper that rescales every quantity. */
export function Ingredients({ groups, servings: baseServings }: IngredientsProps) {
  const [servings, setServings] = useState(baseServings);
  const amount = (quantity?: number) =>
    quantity === undefined ? "" : formatQuantity(scaleQuantity(quantity, baseServings, servings));

  return (
    <section className={styles.ingredients} aria-labelledby="ingredients-heading">
      <div className={styles.ingredientsHeading}>
        <h2 id="ingredients-heading">Ingredients</h2>
        <div className={styles.stepper} role="group" aria-label="Servings">
          <button type="button" onClick={() => setServings((s) => Math.max(1, s - 1))} aria-label="Fewer servings">−</button>
          <output aria-live="polite">{servings} servings</output>
          <button type="button" onClick={() => setServings((s) => s + 1)} aria-label="More servings">+</button>
        </div>
      </div>
      {groups.map((group, i) => (
        <div key={group.group ?? i}>
          {group.group && <h3>{group.group}</h3>}
          <ul className={styles.ingredientList}>
            {group.items.map((item) => (
              <li key={item.name}>
                <span className={styles.amount}>{[amount(item.quantity), item.unit].filter(Boolean).join(" ")}</span>
                <span>
                  {item.name}
                  {item.note && <span className={styles.note}>, {item.note}</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
