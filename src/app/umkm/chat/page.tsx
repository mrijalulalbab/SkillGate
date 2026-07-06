"use client";

import { UmkmLayout } from "@/components/layout/UmkmLayout";
import { Input } from "@/components/ui/input";
import { Search, Send, Paperclip, MoreVertical, CheckCheck, Loader2, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

interface Contact {
  id: string;
  name: string;
  major: string;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

export default function UmkmChatPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    if (activeContact) {
      loadMessages(activeContact.id);
    }
  }, [activeContact]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  async function loadContacts() {
    setLoadingContacts(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setCurrentUserId(user.id);

      // 1. Get all students who applied to gigs owned by this UMKM
      const { data: appsData } = await supabase
        .from("applications")
        .select(`
          student_id,
          gig:gig_id (umkm_id),
          student:student_id (
            id, full_name,
            student_profiles (major)
          )
        `);

      // 2. Get other users they have exchanged messages with
      const { data: msgsData } = await supabase
        .from("messages")
        .select("sender_id, receiver_id")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      const contactMap = new Map<string, Contact>();

      // Extract from applications where UMKM owns the gig
      (appsData || []).forEach((app: any) => {
        if (app.gig?.umkm_id === user.id && app.student) {
          contactMap.set(app.student.id, {
            id: app.student.id,
            name: app.student.full_name,
            major: app.student.student_profiles?.[0]?.major || "Mahasiswa"
          });
        }
      });

      // Extract from messages
      const otherUserIds = new Set<string>();
      (msgsData || []).forEach((msg) => {
        if (msg.sender_id !== user.id) otherUserIds.add(msg.sender_id);
        if (msg.receiver_id !== user.id) otherUserIds.add(msg.receiver_id);
      });

      // Fetch profile for any extra message users not in map
      for (const otherId of otherUserIds) {
        if (!contactMap.has(otherId)) {
          const { data: uData } = await supabase
            .from("users")
            .select(`
              id, full_name,
              student_profiles (major)
            `)
            .eq("id", otherId)
            .single();

          if (uData) {
            contactMap.set(otherId, {
              id: uData.id,
              name: uData.full_name,
              major: uData.student_profiles?.[0]?.major || "Pengguna"
            });
          }
        }
      }

      const formattedList = Array.from(contactMap.values());
      setContacts(formattedList);
      if (formattedList.length > 0) {
        setActiveContact(formattedList[0]);
      }
    } catch (e) {
      console.error("Error loading UMKM chat contacts:", e);
    } finally {
      setLoadingContacts(false);
    }
  }

  async function loadMessages(contactId: string) {
    setLoadingMsg(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("messages")
        .select("id, sender_id, receiver_id, content, created_at, is_read")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const filtered = (data || []).filter(msg => 
        (msg.sender_id === user.id && msg.receiver_id === contactId) ||
        (msg.sender_id === contactId && msg.receiver_id === user.id)
      );

      setMessages(filtered);
    } catch (e) {
      console.error("Error loading messages:", e);
    } finally {
      setLoadingMsg(false);
    }
  }

  async function handleSendMessage() {
    if (!newMessage.trim() || !activeContact || !currentUserId) return;

    try {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          sender_id: currentUserId,
          receiver_id: activeContact.id,
          content: newMessage,
          is_read: false
        })
        .select()
        .single();

      if (error) throw error;

      setMessages([...messages, data]);
      setNewMessage("");
    } catch (e) {
      console.error("Error sending message:", e);
    }
  }

  return (
    <UmkmLayout>
      <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-background">
        
        {/* Chat List Sidebar */}
        <div className="w-full md:w-80 lg:w-96 border-r border-border/40 bg-white flex flex-col shrink-0 h-full">
          <div className="p-4 border-b border-border/40">
            <h2 className="text-xl font-bold text-foreground mb-4">Pesan</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input className="pl-9 bg-muted/50 border-none" placeholder="Cari percakapan..." />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loadingContacts ? (
              <div className="flex justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-secondary" />
              </div>
            ) : contacts.length === 0 ? (
              <p className="text-center text-muted-foreground p-8 text-sm">Belum ada percakapan aktif.</p>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setActiveContact(contact)}
                  className={`p-4 border-b border-border/40 flex items-start gap-3 cursor-pointer transition-colors ${
                    activeContact?.id === contact.id
                      ? "bg-secondary/5 hover:bg-secondary/10"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="relative w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 border border-secondary/20">
                    <span className="font-bold text-secondary">{(contact.name || "?")[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-sm font-bold text-foreground truncate">{contact.name}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{contact.major}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex flex-1 flex-col bg-[#F5F6F8]">
          {activeContact ? (
            <>
              {/* Chat Header */}
              <div className="h-16 px-6 bg-white border-b border-border/40 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/20">
                    <span className="font-bold text-secondary">{(activeContact.name || "?")[0]}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{activeContact.name}</h3>
                    <p className="text-[10px] text-muted-foreground">{activeContact.major}</p>
                  </div>
                </div>
                <button className="p-2 text-muted-foreground hover:bg-muted rounded-full">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* Messages List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {loadingMsg ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="w-6 h-6 animate-spin text-secondary" />
                  </div>
                ) : messages.length === 0 ? (
                  <p className="text-center text-slate-400 py-10 text-sm">Kirim pesan pertama untuk memulai percakapan.</p>
                ) : (
                  messages.map((msg) => {
                    const isOwnMessage = msg.sender_id === currentUserId;
                    return (
                      <div
                        key={msg.id}
                        className={`flex items-start gap-3 max-w-[80%] ${
                          isOwnMessage ? "ml-auto flex-row-reverse" : ""
                        }`}
                      >
                        <div className="bg-white p-3 rounded-2xl shadow-sm border border-border/40" style={isOwnMessage ? { backgroundColor: 'var(--secondary)', color: 'white' } : {}}>
                          <p className="text-sm">{msg.content}</p>
                          <div className={`flex justify-end items-center gap-1 mt-1 text-[9px] ${
                            isOwnMessage ? "text-secondary-foreground/80" : "text-muted-foreground"
                          }`}>
                            <span>{new Date(msg.created_at).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}</span>
                            {isOwnMessage && <CheckCheck className="w-3 h-3" />}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-border/40 shrink-0">
                <div className="flex items-end gap-2 bg-muted/30 p-2 rounded-2xl border border-border/50 focus-within:border-secondary/50 transition-colors">
                  <button className="p-2 text-muted-foreground hover:text-secondary rounded-full shrink-0 mb-0.5">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <textarea 
                    className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 text-sm py-2 px-1" 
                    rows={1}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Tulis pesan..."
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="p-3 bg-secondary text-secondary-foreground rounded-full hover:shadow-md transition-all shrink-0 mb-0.5"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
              <User className="w-12 h-12 text-slate-400 opacity-40 mb-4" />
              <h3 className="text-lg font-bold text-foreground">Buka Pesan</h3>
              <p className="text-muted-foreground max-w-sm">Pilih salah satu kontak di daftar kiri untuk mulai berdiskusi dengan mahasiswa.</p>
            </div>
          )}
        </div>
      </div>
    </UmkmLayout>
  );
}
