import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Search,
  RefreshCw,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Plus,
  Send
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

interface SupportTicket {
  id: string;
  userId: string;
  userEmail: string;
  subject: string;
  status: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  createdAt: string;
  updatedAt: string;
  notes: InternalNote[];
}

interface InternalNote {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export function SupportTools() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/support/tickets`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch tickets");
      
      const data = await response.json();
      setTickets(data.tickets || []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (ticketId: string) => {
    if (!newNote.trim()) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/support/tickets/${ticketId}/notes`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: newNote }),
        }
      );

      if (!response.ok) throw new Error("Failed to add note");
      
      toast.success("Note added");
      setNewNote("");
      fetchTickets();
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Failed to add note");
    }
  };

  const updateTicketStatus = async (ticketId: string, status: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-51144976/admin/support/tickets/${ticketId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) throw new Error("Failed to update status");
      
      toast.success("Status updated");
      fetchTickets();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    urgent: tickets.filter(t => t.priority === 'urgent').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Support Tools</h1>
          <p className="text-slate-400 mt-2">Manage support tickets and internal notes</p>
        </div>
        <Button onClick={fetchTickets} className="bg-orange-500 hover:bg-orange-600 text-black font-medium">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Tickets</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
            </div>
            <MessageSquare className="w-10 h-10 text-blue-500" />
          </div>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Open Tickets</p>
              <p className="text-3xl font-bold text-yellow-400 mt-1">{stats.open}</p>
            </div>
            <Clock className="w-10 h-10 text-yellow-500" />
          </div>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Urgent</p>
              <p className="text-3xl font-bold text-red-400 mt-1">{stats.urgent}</p>
            </div>
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-900 border-slate-700 text-white"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredTickets.map((ticket) => (
          <Card key={ticket.id} className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-white font-semibold">{ticket.subject}</h3>
                  <Badge className={
                    ticket.priority === 'urgent' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                    ticket.priority === 'high' ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' :
                    ticket.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                    'bg-slate-500/20 text-slate-300 border-slate-500/30'
                  }>
                    {ticket.priority}
                  </Badge>
                  <Badge className={
                    ticket.status === 'resolved' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                    ticket.status === 'in_progress' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                    'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                  }>
                    {ticket.status}
                  </Badge>
                </div>
                <p className="text-slate-400 text-sm">{ticket.userEmail}</p>
              </div>
            </div>

            {ticket.notes.length > 0 && (
              <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
                {ticket.notes.map((note) => (
                  <div key={note.id} className="bg-slate-900/50 p-3 rounded text-sm">
                    <p className="text-slate-300">{note.content}</p>
                    <p className="text-slate-500 text-xs mt-1">
                      {note.author} • {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => updateTicketStatus(ticket.id, 'resolved')}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Resolve
              </Button>
              <Button
                size="sm"
                onClick={() => setSelectedTicket(ticket)}
                className="bg-orange-500 hover:bg-orange-600 text-black font-medium"
              >
                Add Note
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {selectedTicket && (
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <h3 className="text-white font-semibold mb-4">Add Internal Note to: {selectedTicket.subject}</h3>
          <div className="flex gap-3">
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Write an internal note..."
              className="bg-slate-900 border-slate-700 text-white"
              rows={3}
            />
            <Button
              onClick={() => addNote(selectedTicket.id)}
              className="bg-orange-500 hover:bg-orange-600 text-black font-medium"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
