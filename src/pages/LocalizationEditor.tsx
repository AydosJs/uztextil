import React, { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import ruLocale from '@/locales/ru.json'
import uzLocale from '@/locales/uz.json'

interface LocaleEntry {
    key: string
    ru: string
    uz: string
    path: string
}

const LocalizationEditor: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [localeData, setLocaleData] = useState<LocaleEntry[]>([])
    const [editingKey, setEditingKey] = useState<string | null>(null)
    const [editValues, setEditValues] = useState<{ ru: string; uz: string }>({ ru: '', uz: '' })

    // Flatten the nested JSON structure into a flat array
    const flattenLocaleData = (obj: any, prefix = ''): LocaleEntry[] => {
        const entries: LocaleEntry[] = []

        for (const key in obj) {
            const currentPath = prefix ? `${prefix}.${key}` : key

            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                // Recursively process nested objects
                entries.push(...flattenLocaleData(obj[key], currentPath))
            } else {
                // This is a leaf value
                const ruValue = getNestedValue(ruLocale, currentPath) || ''
                const uzValue = getNestedValue(uzLocale, currentPath) || ''

                entries.push({
                    key: currentPath,
                    ru: ruValue,
                    uz: uzValue,
                    path: currentPath
                })
            }
        }

        return entries
    }

    // Helper function to get nested values
    const getNestedValue = (obj: any, path: string): string => {
        const keys = path.split('.')
        let current = obj

        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key]
            } else {
                return ''
            }
        }

        return typeof current === 'string' ? current : ''
    }

    // Initialize locale data
    useEffect(() => {
        const flattened = flattenLocaleData(ruLocale)
        setLocaleData(flattened)
    }, [])

    // Filter data based on search term
    const filteredData = useMemo(() => {
        if (!searchTerm) return localeData

        return localeData.filter(entry =>
            entry.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.ru.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.uz.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [localeData, searchTerm])

    // Start editing an entry
    const startEditing = (entry: LocaleEntry) => {
        setEditingKey(entry.key)
        setEditValues({ ru: entry.ru, uz: entry.uz })
    }

    // Save changes
    const saveChanges = () => {
        if (!editingKey) return

        setLocaleData(prev =>
            prev.map(entry =>
                entry.key === editingKey
                    ? { ...entry, ru: editValues.ru, uz: editValues.uz }
                    : entry
            )
        )

        setEditingKey(null)
        setEditValues({ ru: '', uz: '' })
    }

    // Cancel editing
    const cancelEditing = () => {
        setEditingKey(null)
        setEditValues({ ru: '', uz: '' })
    }

    // Download JSON file
    const downloadJSON = (locale: 'ru' | 'uz') => {
        const data = locale === 'ru' ? ruLocale : uzLocale

        // Update the data with current edits
        const updatedData = { ...data }
        localeData.forEach(entry => {
            if (locale === 'ru') {
                setNestedValue(updatedData, entry.key, entry.ru)
            } else {
                setNestedValue(updatedData, entry.key, entry.uz)
            }
        })

        const jsonString = JSON.stringify(updatedData, null, 2)
        const blob = new Blob([jsonString], { type: 'application/json' })
        const url = URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = url
        link.download = `${locale}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    // Helper function to set nested values
    const setNestedValue = (obj: any, path: string, value: string) => {
        const keys = path.split('.')
        let current = obj

        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
                current[keys[i]] = {}
            }
            current = current[keys[i]]
        }

        current[keys[keys.length - 1]] = value
    }

    return (
        <div className="min-h-screen bg-background-primary p-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white mb-4">Localization Editor</h1>

                    {/* Search */}
                    <div className="mb-4">
                        <Input
                            type="text"
                            placeholder="Search by key, Russian text, or Uzbek text..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    {/* Download buttons */}
                    <div className="flex gap-2 mb-4">
                        <Button
                            onClick={() => downloadJSON('ru')}
                            variant="outline"
                            className="text-white border-white hover:bg-white hover:text-black"
                        >
                            Download Russian JSON
                        </Button>
                        <Button
                            onClick={() => downloadJSON('uz')}
                            variant="outline"
                            className="text-white border-white hover:bg-white hover:text-black"
                        >
                            Download Uzbek JSON
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <Card className="bg-background-secondary">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-600">
                                    <th className="text-left p-4 text-white font-semibold">Key</th>
                                    <th className="text-left p-4 text-white font-semibold">Russian</th>
                                    <th className="text-left p-4 text-white font-semibold">Uzbek</th>
                                    <th className="text-left p-4 text-white font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((entry) => (
                                    <tr key={entry.key} className="border-b border-gray-700 hover:bg-gray-800">
                                        <td className="p-4 text-gray-300 font-mono text-sm">
                                            {entry.key}
                                        </td>
                                        <td className="p-4">
                                            {editingKey === entry.key ? (
                                                <Input
                                                    value={editValues.ru}
                                                    onChange={(e) => setEditValues(prev => ({ ...prev, ru: e.target.value }))}
                                                    className="w-full"
                                                />
                                            ) : (
                                                <span className="text-white">{entry.ru}</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {editingKey === entry.key ? (
                                                <Input
                                                    value={editValues.uz}
                                                    onChange={(e) => setEditValues(prev => ({ ...prev, uz: e.target.value }))}
                                                    className="w-full"
                                                />
                                            ) : (
                                                <span className="text-white">{entry.uz}</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {editingKey === entry.key ? (
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={saveChanges}
                                                        className="bg-green-600 hover:bg-green-700"
                                                    >
                                                        Save
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={cancelEditing}
                                                        className="text-white border-white hover:bg-white hover:text-black"
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => startEditing(entry)}
                                                    className="text-white border-white hover:bg-white hover:text-black"
                                                >
                                                    Edit
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {filteredData.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-400">No entries found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default LocalizationEditor
