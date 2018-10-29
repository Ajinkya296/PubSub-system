import os,sys
cwd = os.getcwd()
os_name =  sys.platform
print("Docker OS : "+ os_name)
print("")

a= 0
b= 1
for i in xrange(10):
	print(a)
	n = a+b
	a = b
	b = n