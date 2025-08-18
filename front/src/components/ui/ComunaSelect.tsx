"use client";

import * as React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useComunas } from "@/hooks/useComunas";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

type Props = {
  value?: string;
  onChange: (codigo: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

function normalize(s: string) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default function ComunaSelect({
  value,
  onChange,
  placeholder = "Escribe para buscar...",
  className,
  disabled,
}: Props) {
  const { comunas, loading, error } = useComunas();

  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  // Enfocar buscador al abrir; limpiar query al cerrar
  React.useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
    setQuery("");
  }, [open]);

  const selectedLabel = React.useMemo(
    () => comunas.find((c: any) => c.value === value)?.label ?? "",
    [comunas, value]
  );

  const filtered = React.useMemo(() => {
    const q = normalize(query);
    if (!q) return comunas;
    return comunas.filter((c: any) => {
      const byName = normalize(c.name).includes(q);
      const byLabel = normalize(c.label).includes(q);
      const byCodePrefix = String(c.value).startsWith(query.trim());
      return byName || byLabel || byCodePrefix;
    });
  }, [query, comunas]);

  // Teclas dentro del input (bloquea typeahead del Select y soporta Enter/Escape)
  const onInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    e.stopPropagation();
    if (e.key === "Enter") {
      e.preventDefault();
      const first = filtered[0];
      if (first) onChange(first.value);
      setOpen(false);
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setQuery("");
      inputRef.current?.focus();
    }
  };

  // Red de seguridad a nivel de Content
  const onContentKeyDownCapture: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.target === inputRef.current) e.stopPropagation();
  };

  const clearAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuery("");
    onChange("");
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  return (
    <Select
      value={value ?? ""}
      onValueChange={onChange}
      disabled={disabled || loading}
      open={open}
      onOpenChange={setOpen}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue
          placeholder={loading ? "Cargando comunas..." : selectedLabel || placeholder}
        />
      </SelectTrigger>

      <SelectContent
        position="popper"
        className="w-[var(--radix-select-trigger-width)]"
        onCloseAutoFocus={(e) => e.preventDefault()}
        onKeyDownCapture={onContentKeyDownCapture}
      >
        {/* Header: título + limpiar (sticky) */}
        <div className="sticky top-0 z-20 bg-popover/95 backdrop-blur supports-[backdrop-filter]:bg-popover/70 border-b px-3 pt-2 pb-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">Comunas</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="h-7 px-2"
              onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
            >
              <X className="mr-1 h-3.5 w-3.5" />
              Limpiar
            </Button>
          </div>

          {/* Buscador */}
          <Input
            ref={inputRef}
            placeholder="Buscar por nombre o código…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            className="h-9 text-sm"
          />
          {error && <p className="text-xs text-red-600 mt-2">Error: {error}</p>}
        </div>

        {/* Lista */}
        <SelectGroup>
          {filtered.length === 0 && (
            <div className="px-3 py-3 text-sm text-muted-foreground">
              No se encontraron comunas.
            </div>
          )}
          {filtered.map((c: any) => (
            <SelectItem key={c.value} value={c.value} className="text-sm">
              {c.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
