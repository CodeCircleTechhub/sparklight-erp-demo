import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, ArrowLeft, Search, MoreVertical, Phone, Video, Image, Paperclip, Smile } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  senderRole: string;
  content: string;
  time: string;
  isOwn: boolean;
}

interface Conversation {
  id: string;
  name: string;
  role: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

const conversations: Conversation[] = [
  { id: '1', name: 'Dr. Ahmed Hassan', role: 'Doctor', lastMessage: 'Patient test results are ready', time: '2m ago', unread: 3, online: true },
  { id: '2', name: 'Nurse Aisha Ibrahim', role: 'Nurse', lastMessage: 'Vital signs recorded for PT-00021', time: '15m ago', unread: 1, online: true },
  { id: '3', name: 'Pharmacist Musa Yusuf', role: 'Pharmacist', lastMessage: 'Prescription dispensed', time: '1h ago', unread: 0, online: false },
  { id: '4', name: 'Lab Technician Fatima Aliyu', role: 'Laboratory', lastMessage: 'Blood test samples collected', time: '2h ago', unread: 0, online: true },
  { id: '5', name: 'Receptionist Halima Bello', role: 'Receptionist', lastMessage: 'New patient registered', time: '3h ago', unread: 0, online: false },
  { id: '6', name: 'Dr. Ibrahim Suleiman', role: 'Doctor', lastMessage: 'Consultation notes updated', time: '5h ago', unread: 0, online: false },
];

const messages: Message[] = [
  { id: '1', sender: 'Dr. Ahmed Hassan', senderRole: 'Doctor', content: 'Good morning, I need to discuss the lab results for patient PT-00021', time: '9:00 AM', isOwn: false },
  { id: '2', sender: 'You', senderRole: 'Admin', content: 'Good morning Dr. Ahmed. Sure, what are the findings?', time: '9:02 AM', isOwn: true },
  { id: '3', sender: 'Dr. Ahmed Hassan', senderRole: 'Doctor', content: 'The blood sugar levels are elevated. I recommend starting metformin 500mg twice daily', time: '9:05 AM', isOwn: false },
  { id: '4', sender: 'You', senderRole: 'Admin', content: 'Noted. Should we schedule a follow-up appointment?', time: '9:08 AM', isOwn: true },
  { id: '5', sender: 'Dr. Ahmed Hassan', senderRole: 'Doctor', content: 'Yes, please schedule for next week. Also check if the pharmacy has metformin in stock', time: '9:10 AM', isOwn: false },
  { id: '6', sender: 'You', senderRole: 'Admin', content: 'I will check with the pharmacy and schedule the follow-up. Thank you doctor.', time: '9:12 AM', isOwn: true },
  { id: '7', sender: 'Dr. Ahmed Hassan', senderRole: 'Doctor', content: 'Patient test results are ready for review', time: '9:15 AM', isOwn: false },
];

export default function ChatPage() {
  const [selectedConvo, setSelectedConvo] = useState<Conversation | null>(conversations[0]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [allMessages, setAllMessages] = useState<Message[]>(messages);

  const filteredConversations = conversations.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg: Message = {
      id: String(allMessages.length + 1),
      sender: 'You',
      senderRole: 'Admin',
      content: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
    };
    setAllMessages([...allMessages, msg]);
    setNewMessage('');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Conversations List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Link to="/admin/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-primary-600">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </Link>
            <h1 className="text-lg font-bold text-dark-900">Messages</h1>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((convo) => (
            <button
              key={convo.id}
              onClick={() => setSelectedConvo(convo)}
              className={`w-full flex items-center gap-3 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                selectedConvo?.id === convo.id ? 'bg-primary-50 border-l-2 border-l-primary-600' : ''
              }`}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium text-sm">
                  {convo.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                {convo.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm text-dark-900 truncate">{convo.name}</p>
                  <span className="text-xs text-gray-400">{convo.time}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{convo.lastMessage}</p>
              </div>
              {convo.unread > 0 && (
                <span className="w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                  {convo.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConvo ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium text-sm">
                {selectedConvo.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h2 className="font-medium text-dark-900">{selectedConvo.name}</h2>
                <p className="text-xs text-gray-500">{selectedConvo.role} - {selectedConvo.online ? 'Online' : 'Offline'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                <Video className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {allMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-md rounded-lg px-4 py-2 ${
                  msg.isOwn
                    ? 'bg-primary-600 text-white'
                    : 'bg-white border border-gray-200'
                }`}>
                  {!msg.isOwn && (
                    <p className="text-xs font-medium text-primary-600 mb-1">{msg.sender}</p>
                  )}
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.isOwn ? 'text-primary-200' : 'text-gray-400'}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                <Paperclip className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                <Image className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                <Smile className="w-5 h-5" />
              </button>
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
              <button
                onClick={handleSend}
                className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <p className="text-gray-400">Select a conversation to start messaging</p>
        </div>
      )}
    </div>
  );
}
