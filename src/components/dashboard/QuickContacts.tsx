'use client'

import { useState } from 'react'
import { Card, Input, Badge, Button } from '@/components/ui'
import { formatRelativeDate, cn } from '@/lib/utils'
import {
  Search,
  Star,
  StarOff,
  Mail,
  Phone,
  MessageSquare,
  Users,
  Building2,
  UserCheck,
} from 'lucide-react'

interface Contact {
  id: string
  name: string
  role: string
  category: 'EXECUTIVE' | 'TEAM' | 'PARTNER'
  email: string
  phone?: string
  avatarUrl?: string
  isFavorite: boolean
  lastContacted?: Date
}

// Demo data
const demoContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'CEO',
    category: 'EXECUTIVE',
    email: 'sarah@company.com',
    phone: '+1 (555) 123-4567',
    isFavorite: true,
    lastContacted: new Date(Date.now() - 86400000),
  },
  {
    id: '2',
    name: 'Mike Johnson',
    role: 'Head of Marketing',
    category: 'TEAM',
    email: 'mike@company.com',
    phone: '+1 (555) 234-5678',
    isFavorite: true,
    lastContacted: new Date(Date.now() - 3600000),
  },
  {
    id: '3',
    name: 'Emily Davis',
    role: 'Copywriter Lead',
    category: 'TEAM',
    email: 'emily@company.com',
    isFavorite: false,
    lastContacted: new Date(Date.now() - 7200000),
  },
  {
    id: '4',
    name: 'David Wilson',
    role: 'Meta Ads Partner',
    category: 'PARTNER',
    email: 'david@agency.com',
    phone: '+1 (555) 345-6789',
    isFavorite: false,
  },
  {
    id: '5',
    name: 'Lisa Park',
    role: 'CFO',
    category: 'EXECUTIVE',
    email: 'lisa@company.com',
    isFavorite: false,
  },
  {
    id: '6',
    name: 'Tom Roberts',
    role: 'Sales Lead',
    category: 'TEAM',
    email: 'tom@company.com',
    phone: '+1 (555) 456-7890',
    isFavorite: false,
    lastContacted: new Date(Date.now() - 172800000),
  },
]

const categoryIcons = {
  EXECUTIVE: Building2,
  TEAM: Users,
  PARTNER: UserCheck,
}

const categoryColors = {
  EXECUTIVE: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
  TEAM: 'text-primary-600 bg-primary-100 dark:bg-primary-900/30',
  PARTNER: 'text-success-600 bg-success-100 dark:bg-success-900/30',
}

export function QuickContacts() {
  const [contacts, setContacts] = useState(demoContacts)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      !selectedCategory || contact.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Sort: favorites first, then by last contacted
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1
    if (a.lastContacted && b.lastContacted) {
      return b.lastContacted.getTime() - a.lastContacted.getTime()
    }
    return 0
  })

  const toggleFavorite = (id: string) => {
    setContacts(
      contacts.map((c) =>
        c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
      )
    )
  }

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email)
    // Would show toast notification here
  }

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-gray-100 p-4 dark:border-gray-800">
        <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
          Quick Contacts
        </h3>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Category Filter */}
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              !selectedCategory
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
            )}
          >
            All
          </button>
          {Object.entries(categoryIcons).map(([category, Icon]) => (
            <button
              key={category}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === category ? null : category
                )
              }
              className={cn(
                'flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors',
                selectedCategory === category
                  ? categoryColors[category as keyof typeof categoryColors]
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
              )}
            >
              <Icon className="h-3 w-3" />
              {category.charAt(0) + category.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Contacts List */}
      <div className="max-h-[400px] overflow-y-auto">
        {sortedContacts.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {sortedContacts.map((contact) => {
              const CategoryIcon = categoryIcons[contact.category]

              return (
                <div
                  key={contact.id}
                  className="group flex items-center gap-3 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {contact.avatarUrl ? (
                      <img
                        src={contact.avatarUrl}
                        alt={contact.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold',
                          categoryColors[contact.category]
                        )}
                      >
                        {contact.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                    )}
                    <button
                      onClick={() => toggleFavorite(contact.id)}
                      className="absolute -right-1 -top-1"
                    >
                      {contact.isFavorite ? (
                        <Star className="h-4 w-4 fill-warning-400 text-warning-400" />
                      ) : (
                        <StarOff className="h-4 w-4 text-gray-300 opacity-0 group-hover:opacity-100" />
                      )}
                    </button>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white truncate">
                        {contact.name}
                      </span>
                      <CategoryIcon
                        className={cn(
                          'h-3 w-3',
                          categoryColors[contact.category].split(' ')[0]
                        )}
                      />
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {contact.role}
                    </p>
                    {contact.lastContacted && (
                      <p className="text-xs text-gray-400">
                        Last: {formatRelativeDate(contact.lastContacted)}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleCopyEmail(contact.email)}
                      title="Copy email"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    {contact.phone && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => window.open(`tel:${contact.phone}`)}
                        title="Call"
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon-sm" title="Message">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-500">No contacts found</p>
          </div>
        )}
      </div>
    </Card>
  )
}
