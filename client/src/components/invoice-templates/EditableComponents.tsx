import React, { useState } from "react";

// Shared Editable Text Component
export function EditableText({
    value,
    onChange,
    className = "",
    editable = true,
    placeholder = "Click to edit"
}: {
    value: string;
    onChange: (val: string) => void;
    className?: string;
    editable?: boolean;
    placeholder?: string;
}) {
    const [editing, setEditing] = useState(false);
    const [temp, setTemp] = useState(value);

    if (!editable) return <span className={className}>{value}</span>;

    if (editing) {
        return (
            <input
                type="text"
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
                onBlur={() => {
                    onChange(temp);
                    setEditing(false);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        onChange(temp);
                        setEditing(false);
                    }
                    if (e.key === "Escape") {
                        setTemp(value);
                        setEditing(false);
                    }
                }}
                autoFocus
                className={`bg-yellow-50 border-2 border-yellow-400 rounded px-1 outline-none focus:ring-2 focus:ring-yellow-500 ${className}`}
                style={{ minWidth: "60px" }}
            />
        );
    }
    return (
        <span
            onClick={() => {
                setTemp(value);
                setEditing(true);
            }}
            className={`cursor-pointer hover:bg-yellow-100 rounded px-0.5 border border-transparent hover:border-yellow-300 transition-colors ${className}`}
            title="Click to edit"
        >
            {value || <span className="text-gray-400 italic text-sm">{placeholder}</span>}
        </span>
    );
}

// Shared Editable Number Component
export function EditableNumber({
    value,
    onChange,
    className = "",
    editable = true,
    prefix = ""
}: {
    value: number;
    onChange: (val: number) => void;
    className?: string;
    editable?: boolean;
    prefix?: string;
}) {
    const [editing, setEditing] = useState(false);
    const [temp, setTemp] = useState(value.toString());

    if (!editable) return <span className={className}>{prefix}{value}</span>;

    if (editing) {
        return (
            <input
                type="number"
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
                onBlur={() => {
                    onChange(parseFloat(temp) || 0);
                    setEditing(false);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        onChange(parseFloat(temp) || 0);
                        setEditing(false);
                    }
                    if (e.key === "Escape") {
                        setTemp(value.toString());
                        setEditing(false);
                    }
                }}
                autoFocus
                className={`bg-yellow-50 border-2 border-yellow-400 rounded px-1 outline-none w-20 focus:ring-2 focus:ring-yellow-500 ${className}`}
            />
        );
    }
    return (
        <span
            onClick={() => {
                setTemp(value.toString());
                setEditing(true);
            }}
            className={`cursor-pointer hover:bg-yellow-100 rounded px-0.5 border border-transparent hover:border-yellow-300 transition-colors ${className}`}
            title="Click to edit"
        >
            {prefix}{value}
        </span>
    );
}
