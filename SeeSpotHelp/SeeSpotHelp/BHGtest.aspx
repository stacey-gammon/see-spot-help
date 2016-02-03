<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="BHGtest.aspx.cs" Inherits="SeeSpotHelp.BHGtest" %>

<!DOCTYPE html>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
<script src="/app/scripts/volunteer.js" type="text/javascript"></script>
<script>
    var vt = LoadVolunteer(1);
    alert(vt.email);
</script>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    <asp:label runat="server" text="Label" ID="label1"></asp:label>
    </div>
    </form>
</body>
</html>
