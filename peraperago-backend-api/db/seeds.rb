Card.destroy_all
Deck.destroy_all
User.destroy_all

u1 = User.create(username: "Kazuki")

d1 = Deck.create(title: "JLPT")
d2 = Deck.create(title: "みんなの日本語")
d3 = Deck.create(title: "読書")
d4 = Deck.create(title: "美穂先生")

a_side_1 = ['synthetic fiber, chemical fiber (abbr)', 'solidarity / joint, collective', 'very small, tiny', "when it's important, when push comes to shove, in one's hour of need", 'gallant, brave, chivalrous, dignified', 'to scold, to tell off / to question persistently', 'distillation', 'e-book, electronic book', '(outward) appearance / appearances, decency, display / lip-service', 'presence, dignity', 'careful, scrupulous, thorough, attentive', 'jurisdiction, control', 'preliminary contest, qualifying round, primary', 'to be common, to be commonplace', 'firmly, solidly, sturdily', 'negligent, neglectful, careless', "to fill (one's heart), to experience a welling up of feelings or sensations", 'command, generalship, leadership', 'person concerned, related party', 'fresh and youthful, lively, vibrant, fresh (e.g. fruit)']
b_side_1 = ['化繊', '連帯', 'ちっぽけ（な）', 'いざという時（に）', '凛々しい', '（を）なじる（なじります）', '蒸留', '電子書籍', '体裁', '貫禄', '念入りな','管轄', '予選', '（が）ありふれる', 'がっしり（する）', '疎かな', '（が）こみ上げる', '統率', '当事者', 'みずみずしい']

i = 0
while i < 20
    Card.create(a_side: a_side_1[i], b_side: b_side_1[i], new: true, user: u1, deck: d1)
    i += 1
end

a_side_2 = ['finish up, complete, get through', 'art exhibition', 'careless person', 'per person, per capita, per head', 'motionlessly / fixedly, intently', 'local specialty, special product (of a region)', 'full price', 'have no recollection, know nothing about', 'separate volume, extra issue', 'personal belongings', 'cause, induce, bring about', '(car parking) market', 'reward, repay / retaliate, get revenge', 'personal identification number, PIN', 'invoiced amount', 'spoiled child, pampered child', 'casual, unconcerned, nonchalant', 'daydream, fantasy', 'take measures, work out a plan', 'irony, sarcasm, cynicism']
b_side_2 = ['（を）仕上げる', '美術展', '慌て者', '一人当たり', 'じっと', '特産品', '全額', '身に覚えがない', '別冊', '持ち物', '（を）引き起こす', '市場（駐車場〜）', '（に）報いる', '暗証番号', '請求金額', '甘えん坊な', '何気ない', '空想', '（を）講ずる
', '皮肉']

j = 0
while j < 20
    Card.create(a_side: a_side_2[j], b_side: b_side_2[j], new: true, user: u1, deck: d2)
    j += 1
end

a_side_3 = ['established practice, custom', 'fighting spirit, (will to) fight', 'class, level, hierarchy', 'statute of limitations, lapse of rights after a period of time', 'achievement, accomplishment, realization', 'to strain, to stretch, to make tense', 'draft proposal, tentative plan', 'tolerant, generous, magnanimous', 'definite, final, decisive, conclusive', 'to partition, to divide / to direct, to manage, to run', 'smoothly, without resistance, without trouble', 'advocacy, promotion', 'civilization, enlightenment', 'beyond expectations, not foreseen', 'to take along, to hold in the hand / to hang (e.g. from the shoulder or waist)', 'to succeed (in doing), to pull something off, to manage (to do a job)', 'imprudent (misguided) fellow', 'reading (a text) aloud without trying to understand it', 'selfish, self-centered, egotistical', 'loss of appetite, anorexia']
b_side_3 = ['恒例', '闘志', '階層', '時効', '達成', '（を）張り詰める', 'たたき台', '寛大な', '決定的な', '（を）仕切る', 'すんなり（と）（する）', '主唱', '開明', '想定外', '（を）提げる', '（を）やってのける', '不心得者', '素読', '身勝手な', '食欲不振']

k = 0
while k < 20
    Card.create(a_side: a_side_3[k], b_side: b_side_3[k], new: true, user: u1, deck: d3)
    k += 1
end

a_side_4 = ['joint liability on guarantee', 'underlying disease, underlying condition', "pining for what one doesn't have, thinking the grass is greener on the other side of the fence", 'show-off', 'hypersensitivity', 'basking in the sun', 'camouflage, disguise / feigning, masquerade', 'unsung hero, person who does a thankless task', 'corpulence, fatness, obesity', 'adapting oneself to the requirements of the moment, playing by ear', 'to put in personal feelings, to harbor feelings', 'to take a step forward / to start on a project, etc.', 'useless resistance, vain struggle', 'devoted, self-sacrificing', 'to recite an incantation, to cast a spell', 'spending the night in a car, train, bus, etc.', 'to acquire a trade, to learn a vocation', 'animal rights, animal welfare, animal protection', 'to tie one on, to get drunk', 'giving a loud pep talk, encouraging (somebody) strongly in a loud voice']
b_side_4 = ['連帯保証', '基礎疾患', '無い物ねだり', '目立ちたがり', '感覚過敏症', '日向ぼっこ', '偽装', '縁の下の力持ち', '肥満', '臨機応変な', '私情を挟む', '一歩を踏み出す', '悪あがき', '献身的な', '呪文を唱える', '車中泊', '手に職をつける', '動物愛護', '酒気を帯びる', '叱咤激励']

l = 0
while l < 20
    Card.create(a_side: a_side_4[l], b_side: b_side_4[l], new: true, user: u1, deck: d4)
    l += 1
end
